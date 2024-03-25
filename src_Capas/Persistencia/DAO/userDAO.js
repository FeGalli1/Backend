import { logError } from '../../Errores/Winston.js'
import User from '../models/UserModel.js'

export const getAllUsers = async () => {
    try {
        const users = await User.find() // Aquí estás obteniendo todos los usuarios de la base de datos

        return users
    } catch (error) {
        throw logError(500, 'Error al obtener los usuarios desde la base de datos.')
    }
}
export const getUserById = async userId => {
    try {
        const user = await User.findById(userId)
        return user
    } catch (error) {
        throw logError(500, 'Error al obtener el usuario desde la base de datos.')
    }
}
