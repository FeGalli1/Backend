import { Router } from "express";
import User from "../../Persistencia/models/UserModel.js";
import { logError, logWarning } from "../../Errores/Winston.js";

const router = Router()

router.put('/premium/:uid', async (req, res) => {
    const userId = req.params.uid
    try {
        const user = await User.findById(userId);
        if (!user) {
            logError(`No se encontró un usuario con el id: ${userId}`);
            return res.status(500).send('Error al obtener el usuario');
        }
        if (user.role === 'premium') {
            user.role = 'user';
        } else if (user.role === 'user') {
            user.role = 'premium';
        } else {
            logWarning(`Se intentó cambiar el rol del usuario ${user} pero es administrador`);
            return res.status(500).send('Error, el usuario es administrador');
        }
        await user.save();
        res.status(200).send('Rol de usuario cambiado correctamente.');
    } catch (error) {
        logError(`Error al cambiar el rol del usuario ${userId}: ${error.message}`);
        res.status(500).send('Error al cambiar el rol del usuario');
    }
});

export { router };
