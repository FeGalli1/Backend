import { Router } from 'express'
import passport from 'passport'
import { requireAuth } from '../../Controles/middleware/authMiddleware.js'
import { requireAdmin } from '../../Controles/middleware/adminMiddleware.js'

const router = Router()

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ status: 'success', user: req.user })
})

// Logout
router.get('/logout', (req, res) => {
    req.logout()
    res.json({ status: 'success', message: 'Logout successful' })
})

// Current User
router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        // Crear un DTO del usuario con la información necesaria
        const userDTO = {
            id: req.user.id,
            Nombre: req.user.first_name,
            Apellido: req.user.last_name,
            email: req.user.email,
            // asi evito enviar la contraseña, el rol, el id del carrito, etc.
        }

        res.json({ status: 'success', user: userDTO })
    } else {
        res.status(401).json({ status: 'error', message: 'User not authenticated' })
    }
})

router.get('/protected-route', requireAuth, (req, res) => {
    // Lógica de la ruta protegida para usuarios autenticados
    res.json({ status: 'success', message: 'Acceso permitido para usuarios autenticados' })
})

router.post('/admin-route', requireAuth, requireAdmin, (req, res) => {
    // Lógica de la ruta que requiere ser administrador
    res.json({ status: 'success', message: 'Acceso permitido para administradores' })
})

export { router }
