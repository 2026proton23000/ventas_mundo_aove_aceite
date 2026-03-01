import { formatearPrecio } from './utils.js';

const TELEGRAM_TOKEN = '8144991223:AAGs60-oFtaZQmQUPnHPNMULGGb_SU6uSI8';
const TELEGRAM_CHAT_ID = '6051665667';

/**
 * Envoie un message à Telegram
 * @param {string} mensaje - Le message à envoyer
 * @returns {Promise<boolean>} Succès ou échec
 */
async function enviarMensaje(mensaje) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error enviando mensaje a Telegram:', error);
        return false;
    }
}

/**
 * Envoie une commande (panier) à Telegram
 * @param {Object} datos - Les données de la commande
 */
export async function enviarPedido(datos) {
    const mensaje = `
🫒 *Nuevo pedido - Mundo Aove Tacna*

*Cliente:* ${datos.nombre} ${datos.apellido}
📧 Email: ${datos.email}
📞 Teléfono: ${datos.telefono}

📍 *Dirección:*
${datos.direccion}
${datos.ciudad}, ${datos.region} - ${datos.codigo_postal}

🚚 *Tipo de envío:* ${datos.tipo_envio === 'tacna' ? 'Entrega en Tacna' : 'Envío nacional'}
💰 *Método de pago:* ${datos.metodo_pago}

📝 *Notas:* ${datos.notas || 'Ninguna'}

🛒 *Productos:*
${datos.detalles.join('\n')}

💵 *Total:* ${datos.total}
    `;
    return enviarMensaje(mensaje);
}

/**
 * Envoie un message de contact à Telegram
 * @param {Object} datos - Les données du formulaire de contact
 */
export async function enviarMensajeContacto(datos) {
    const { nombre, email, mensaje } = datos;

    const texto = `
📬 *Mensaje de contacto - Mundo Aove Tacna*

👤 *Nombre:* ${nombre}
📧 *Email:* ${email}
💬 *Mensaje:* ${mensaje}
    `;
    return enviarMensaje(texto);
}