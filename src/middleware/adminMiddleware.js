import { getUserById } from '../controllers/UserControllers.js';

export const requireAdmin = async (req, res, next) => {
    try {
        const user = await getUserById(req.session.userId);
        if (user && user.role === 'admin') {
            return next();
        } else {
            console.log("necesitas cuenta administracion", user)
            res.redirect('/products');
        }
    } catch (error) {
        res.redirect('/login');
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al verificar el rol de administrador.',
        });
    }
};
