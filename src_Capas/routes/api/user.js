import { Router } from 'express'
import User from '../../Persistencia/models/UserModel.js'
import multer from 'multer'
import { logError, logWarning } from '../../Errores/Winston.js'
import { resolve } from 'path' // Importar resolve específicamente desde el módulo path
import __dirname from '../../Controles/utils/helpers.js'
import fs from 'fs'
import { deleteProductsByUserId } from '../../Controles/controllers/ProductsControllers.js'
import { sendGmail } from '../../email.js'

const router = Router()

// Directorio de destino absoluto
const destinationPath = resolve(__dirname, '../../../documents')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destinationPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })

// router.get('/', (req, res) => {

// })
// Ruta GET para renderizar el formulario de carga de documentos
router.get('/nuevodoc', (req, res) => {
    const userId = req.session.user._id // Obtener el ID del usuario de la sesión
    res.render('uploadDocuments', { userId })
})
router.post('/:uid/documents', upload.single('documents'), async (req, res) => {
    const { uid } = req.params
    const { documentType } = req.body
    const file = req.file

    try {
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Leer el contenido del archivo y convertirlo en base64
        const fileContent = fs.readFileSync(file.path, { encoding: 'base64' })

        // Buscar si ya hay un documento del mismo tipo (perfil o DNI)
        const existingDocument = user.documents.find(document => document.name === documentType)
        if (existingDocument) {
            // Si ya existe un documento del mismo tipo, actualizar su contenido
            existingDocument.content = fileContent
        } else {
            // Si no existe, agregar el nuevo documento al array de documentos
            const newDocument = {
                name: documentType,
                content: fileContent,
            }
            user.documents.push(newDocument)
        }

        // Guardar los cambios en el usuario
        await user.save()

        // Eliminar el archivo del sistema de archivos después de guardarlo en MongoDB
        fs.unlinkSync(file.path)

        req.session.successDocProfile = 'Documento cargado exitosamente'
        return res.redirect('/profile')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})

router.post('/premium/:uid', async (req, res) => {
    const userId = req.params.uid
    try {
        const user = await User.findById(userId)
        if (!user) {
            logError(`No se encontró un usuario con el id: ${userId}`)
            return res.status(500).send('Error al obtener el usuario')
        }

        // Cambiar el rol del usuario solo si tiene una foto de perfil
        if (user.role === 'premium') {
            user.role = 'user'
            req.session.successMessageProfile = 'Rol de usuario cambiado correctamente.'
        } else if (user.role === 'user') {
            // Verificar si el usuario tiene cargada la foto de perfil
            const profileDocument = user.documents.find(document => document.name === 'profile')
            if (!profileDocument) {
                logWarning(`El usuario ${user._id} intentó cambiar a usuario premium sin cargar la foto de perfil`)
                req.session.errorMessageProfile = 'Error al cambiar el rol del usuario'
                return res.redirect('/admin/profiles')
            }
            user.role = 'premium'
        }
        // Guardar los cambios en el usuario
        await user.save()
        return res.redirect('/admin/profiles')
    } catch (error) {
        logError(`Error al cambiar el rol del usuario ${userId}: ${error.message}`)
        req.session.errorMessageProfile = 'Error al cambiar el rol del usuario'
        return res.redirect('/admin/profiles')
    }
})

// Ruta para eliminar usuarios inactivos y enviar correos electrónicos
router.delete('/', async (req, res) => {
    try {
        // Obtener la fecha actual menos 2 días
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        // Buscar usuarios que no han tenido conexión en los últimos 2 días
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } })
        console.log(inactiveUsers)
        // Eliminar usuarios inactivos y enviar correos electrónicos
        await Promise.all(
            inactiveUsers.map(async user => {
                if (user.role !== 'admin') {
                    if (user.role === 'premium') {
                        // Eliminar los productos del usuario
                        await deleteProductsByUserId(user._id)
                    }
                    // Eliminar al usuario
                    await User.findByIdAndDelete(user._id)

                    // Enviar correo electrónico al usuario
                    try {
                        sendGmail(
                            user.email,
                            'Cuenta eliminada por inactividad',
                            'Tu cuenta ha sido eliminada debido a la inactividad.'
                        )
                    } catch (error) {
                        logError(`Error al enviar correo electrónico a ${user.email}: ${error.message}`)
                    }
                }
            })
        )

        res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente.' })
    } catch (error) {
        logError(`Error al eliminar usuarios inactivos: ${error.message}`)
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos.' })
    }
})

// Ruta para eliminar usuarios especificos
router.delete('/:uid', async (req, res) => {
    const userId = req.params.uid
    try {
        const user = await User.findById(userId)
        await deleteProductsByUserId(userId)

        // Eliminar al usuario
        await User.findByIdAndDelete(userId)

        // Enviar correo electrónico al usuario
        try {
            sendGmail(
                user.email,
                'Cuenta eliminada por administrador',
                'Tu cuenta ha sido eliminada por un administrador.'
            )
        } catch (error) {
            logError(`Error al enviar correo electrónico a ${user.email}: ${error.message}`)
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente.' })
    } catch (error) {
        logError(`Error al eliminar usuario: ${error.message}`)
        res.status(500).json({ error: 'Error al eliminar usuario.' })
    }
})

export { router }

// export { router }
