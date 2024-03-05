'use strict'

const removeExtensionFilename = filename => filename.split('.').shift()

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // register

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) //  login

import { v4 as uuidv4 } from 'uuid'
import { Ticket } from '../../Persistencia/models/TicketsModel.js' // Asegúrate de proporcionar la ruta correcta al modelo Ticket
import User from '../../Persistencia/models/UserModel.js'

// Función para generar y verificar un código único
export const generateUniqueCode = async () => {
    let isUnique = false
    let code

    // Intenta generar un código único hasta que encuentre uno que no exista en la base de datos
    while (!isUnique) {
        code = uuidv4() // Genera un código

        // Verifica si el código ya existe en la base de datos
        const existingTicket = await Ticket.findOne({ code })

        // Si no existe, marca la bandera como verdadera
        if (!existingTicket) {
            isUnique = true
        }
    }

    return code
}
export const calculateTotalAmount = productsToPurchase => {
    let totalAmount = 0

    for (const purchase of productsToPurchase) {
        const productPrice = purchase.product.price
        const quantity = purchase.quantity

        // Añadir el costo total de este producto al total
        totalAmount += productPrice * quantity
    }

    return totalAmount
}

import crypto from 'crypto'
import { sendGmail } from '../../email.js'
import config from '../../config.js'

//  Generación de token de restablecimiento de contraseña
const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex')
}

// Envío del correo electrónico con el enlace de restablecimiento
export const sendPasswordResetEmail = async email => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        const resetToken = generateResetToken()
        user.resetToken = resetToken
        user.resetTokenExpiration = Date.now() + 3600000 // 1 hora de expiración
        await user.save()

        const resetLink = `http://localhost:${config.PORT}/reset-password/${resetToken}`
        const emailContent = `Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">Restablecer contraseña</a>`

        // Aquí debes enviar el correo electrónico utilizando tu método de envío de correo electrónico
        // Por ejemplo, puedes usar nodemailer para enviar el correo electrónico
        sendGmail(user.email, 'Restablecer contraseña', emailContent)

        return { success: true, message: 'Correo electrónico enviado con éxito para restablecer la contraseña.' }
    } catch (error) {
        console.error(error)
        throw new Error('Error al enviar el correo electrónico de restablecimiento de contraseña')
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export { removeExtensionFilename }
