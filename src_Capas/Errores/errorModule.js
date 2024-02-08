import { logWarning } from "./Winston.js";

// errorModule.js
export const errors = {
    USER_ALREADY_EXISTS: { status: 400, message: 'El usuario ya existe.' },
    INCOMPLETE_VALUES: { status: 400, message: 'Valores incompletos.' },
    USER_NOT_FOUND: { status: 404, message: 'Usuario no encontrado.' },
    INTERNAL_SERVER_ERROR: { status: 500, message: 'Error interno del servidor.' },

    // cartController errors
    CARRITOS_NOT_FOUND: { status: 500, message: 'Ocurrió un error al obtener los carritos.' },
    CARRITO_NOT_SAVE: { status: 500, message: 'Ocurrió un error al guardar el carrito.' },
    CARRITO_NOT_FOUND: { status: 404, message: 'Carrito no encontrado.' },
    CARRITO_NOT_O: { status: 500, message: 'Ocurrió un error al obtener el carrito.' },
    CARRITO_NO_ELIMINADO: { status: 500, message: 'Ocurrió un error al eliminar el producto del carrito.' },
    CARRITO_UPDATE_ERROR: { status: 500, message: 'Ocurrió un error al actualizar el carrito.' },
    CARRITO_PRODUCT_QUANTITY_UPDATE_ERROR: { status: 500, message: 'Ocurrió un error al actualizar la cantidad del producto en el carrito.' },
    CARRITO_REMOVE_ERROR: { status: 500, message: 'Ocurrió un error al eliminar el carrito.' },
    CARRITO_PURCHASE_ERROR: { status: 500, message: 'Ocurrió un error al finalizar la compra.' },

    // ProductController errors
    PRODUCT_NOT_FOUND: { status: 404, message: 'Producto no encontrado.' },
    PRODUCT_SAVE_ERROR: { status: 500, message: 'Ocurrió un error al guardar el producto.' },
    PRODUCT_UPDATE_ERROR: { status: 500, message: 'Ocurrió un error al actualizar el producto.' },
    PRODUCT_DELETE_ERROR: { status: 500, message: 'Ocurrió un error al eliminar el producto.' },
    PRODUCT_REQUEST_ERROR: { status: 500, message: 'Ocurrió un error al procesar la petición de productos.' },
};

export const createError = (errorCode) => {
    const errorDetails = errors[errorCode] || { status: 500, message: 'Error desconocido.' };
    //estos errores son solo de los controllers por pedido de la entrega anterior, ahora deben de generarse como error desde los dao, para no ver dos veces el mimso error lo mando como Warning
    logWarning(errorDetails)
    return errorDetails;
};
