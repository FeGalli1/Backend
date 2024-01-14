
export const requireAuth = (req, res, next) => {
    // Verifica si el usuario está autenticado
    if (req.session.userId) {
        // Si está autenticado, continúa con la siguiente ruta o middleware
        return next();
    } else {
        // Si no está autenticado, redirecciona a la vista de login
        res.redirect('/login');
    }
};