import { Router } from 'express'
import User from '../../Persistencia/models/UserModel.js'
import multer from 'multer'
import { logError, logWarning } from '../../Errores/Winston.js'

const router = Router()

// Configurar Multer para la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profileImage') {
            cb(null, 'profiles/')
        } else if (file.fieldname === 'productImage') {
            cb(null, 'products/')
        } else {
            cb(null, 'documents/')
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })

// Ruta GET para renderizar el formulario de carga de documentos
router.get('/', (req, res) => {
    const userId = req.session.user._id // Obtener el ID del usuario de la sesión
    res.render('uploadDocuments', { userId })
})

// Endpoint para cargar documentos
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params
    const documents = req.files.map(file => ({
        name: file.originalname,
        reference: `/uploads/${file.filename}`,
    }))

    try {
        const user = await User.findByIdAndUpdate(uid, {
            $push: { documents: { $each: documents } },
        })
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        user.last_connection = new Date()
        await user.save()
        res.status(200).json({ message: 'Documentos cargados exitosamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})

router.put('/premium/:uid', async (req, res) => {
    const userId = req.params.uid
    try {
        const user = await User.findById(userId)
        if (!user) {
            logError(`No se encontró un usuario con el id: ${userId}`)
            return res.status(500).send('Error al obtener el usuario')
        }
        if (user.role === 'premium') {
            user.role = 'user'
        } else if (user.role === 'user') {
            user.role = 'premium'
        } else {
            logWarning(`Se intentó cambiar el rol del usuario ${user} pero es administrador`)
            return res.status(500).send('Error, el usuario es administrador')
        }
        await user.save()
        res.status(200).send('Rol de usuario cambiado correctamente.')
    } catch (error) {
        logError(`Error al cambiar el rol del usuario ${userId}: ${error.message}`)
        res.status(500).send('Error al cambiar el rol del usuario')
    }
})

export { router }

// export { router }
