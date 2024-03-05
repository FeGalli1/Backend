import passport from 'passport'
import { createHash, isValidPassword, sendPasswordResetEmail } from '../utils/helpers.js'
import User from '../../Persistencia/models/UserModel.js'
import { Cart } from '../../persistencia/models/CartsModel.js'
import { createError, errors } from '../../Errores/errorModule.js'
import { logDebug } from '../../Errores/Winston.js'

export const renderLogin = (req, res) => {
    res.render('login')
}

export const renderRegister = (req, res) => {
    res.render('register')
}

export const registerUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const errorDetails = createError(errors.USER_ALREADY_EXISTS)
            return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
        }

        let newUser
        if (role !== undefined) {
            newUser = new User({ email, password: createHash(password), first_name, last_name, role })
        } else {
            newUser = new User({ email, password: createHash(password), first_name, last_name })
        }

        // Solo asigna un carrito si el usuario no es administrador
        if (role !== 'admin') {
            const cart = await Cart.create({ owner: newUser._id })
            newUser.cart = cart._id
        }

        const savedUser = await newUser.save()
        logDebug(savedUser)
        res.redirect('/login')
    } catch (error) {
        console.error(error)
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR)
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
    }
}

export const loginUser = passport.authenticate('local', {
    failureRedirect: '/faillogin',
    failureFlash: true,
})

export const handleSuccessfulLogin = async (req, res) => {
    try {
        // Obtiene el carrito asociado al usuario
        const cart = await Cart.findById(req.user.cart)

        // Guarda el carrito obtenido en la sesión del usuario
        req.session.userCart = cart
        req.session.user = req.user

        res.redirect('/products')
    } catch (error) {
        console.error(error)
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR)
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
    }
}

export const restartPassword = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        const errorDetails = createError(errors.INCOMPLETE_VALUES)
        return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            const errorDetails = createError(errors.USER_NOT_FOUND)
            return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
        }

        const newHashedPassword = createHash(password)
        await User.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } })

        res.send({ status: 'success', message: 'Contraseña restaurada' })
    } catch (error) {
        console.error(error)
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR)
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message })
    }
}

// Controlador para mostrar el formulario de solicitud de restablecimiento de contraseña
export const renderForgotPasswordForm = (req, res) => {
    res.render('forgot-password', { error: null }) // Pasar null para evitar el error inicial
}

// Controlador para procesar el formulario de solicitud de restablecimiento de contraseña
export const processForgotPasswordForm = async (req, res) => {
    const { email } = req.body
    try {
        await sendPasswordResetEmail(email)
        res.render('forgot-password-success')
    } catch (error) {
        console.error(error)
        res.render('forgot-password', {
            error: 'Error al enviar el correo electrónico de restablecimiento de contraseña.',
        })
    }
}

// Controlador para manejar el enlace de restablecimiento de contraseña
export const renderResetPasswordForm = async (req, res) => {
    const token = req.params.token
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        if (!user) {
            return res.render('reset-password-error', {
                error: 'El enlace de restablecimiento de contraseña no es válido o ha expirado.',
            })
        }
        res.render('reset-password', { error: null, token })
    } catch (error) {
        console.error(error)
        res.render('reset-password-error', { error: 'Error al procesar el enlace de restablecimiento de contraseña.' })
    }
}

// Controlador para procesar el formulario de restablecimiento de contraseña
export const processResetPasswordForm = async (req, res) => {
    const { token } = req.params
    const { newPassword, confirmPassword } = req.body

    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        return res.render('reset-password', { error: 'Las contraseñas no coinciden.', token })
    }
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        if (!user) {
            return res.render('reset-password-error', {
                error: 'El enlace de restablecimiento de contraseña no es válido o ha expirado.',
            })
        }
        //la funcion isValidPassword devuelve cuando es valido, significa que coincide con la vieja contraseña
        if (isValidPassword(user, newPassword)) {
            return res.render('reset-password', {
                error: 'La nueva contraseña debe ser diferente a la contraseña actual.',
                token,
            })
        }
        user.password = createHash(newPassword)
        user.resetToken = undefined
        user.resetTokenExpiration = undefined
        await user.save()
        res.render('reset-password-success', {
            success: 'Contraseña restablecida con éxito. Puedes iniciar sesión con tu nueva contraseña.',
        })
    } catch (error) {
        console.error(error)
        res.render('reset-password-error', { error: 'Error al restablecer la contraseña.' })
    }
}

export const changeRole = async (req, res) => {
    const { uid } = req.params
    const { premium } = req.body

    try {
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' })
        }

        // Cambiar el rol del usuario
        user.premium = premium
        await user.save()

        res.status(200).json({ message: `Rol de usuario ${user.email} actualizado a ${premium ? 'premium' : 'user'}.` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor.' })
    }
}
