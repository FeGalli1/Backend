export const requireAuth = (req, res, next) => {
    // Verifica si el usuario está autenticado
    if (req.session.user) {
        // Si está autenticado, continúa con la siguiente ruta o middleware
        return next()
    } else {
        // Si no está autenticado, redirecciona a la vista de login
        res.redirect('/login')
    }
}

// Middleware para verificar el rol de administrador
export const isAdmin = (req, res, next) => {
    // Lógica para verificar si el usuario es administrador
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next()
    } else {
        return res.status(403).json({ status: 'error', message: 'Acceso no autorizado para usuarios' })
    }
}
// Middleware para verificar el rol de usuario
export const isUser = (req, res, next) => {
    // Lógica para verificar si el usuario es un usuario normal
    if (req.user && req.user.role === 'user') {
        return next() // Continuar al siguiente middleware
    } else {
        return res.status(403).json({ status: 'error', message: 'Acceso no autorizado para administradores' })
    }
}
// Middleware para verificar que no es un administrador
export const notAdmin = (req, res, next) => {
    // Lógica para verificar si el usuario no es un administrador
    if (!req.user || (req.user && req.user.role !== 'admin')) {
        return next() // Continuar al siguiente middleware
    } else {
        res.redirect('/admin')
    }
}
