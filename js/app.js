import { registrarVisita } from './tracking.js';
import { cargarProductos } from './products.js';
import { initCarrito, getCarritoYTotal } from './cart.js';
import { enviarPedido, enviarMensajeContacto } from './telegram.js';

document.addEventListener('DOMContentLoaded', () => {
    registrarVisita();

    if (document.getElementById('productos-grid')) {
        cargarProductos();
    }

    initCarrito();

    // Bouton d'envoi de commande
    const btnEnviar = document.getElementById('enviar-pedido');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', async () => {
            const nombre = document.getElementById('nombre')?.value.trim();
            const apellido = document.getElementById('apellido')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const telefono = document.getElementById('telefono')?.value.trim();
            const direccion = document.getElementById('direccion')?.value.trim();
            const ciudad = document.getElementById('ciudad')?.value.trim();
            const region = document.getElementById('region')?.value.trim();
            const codigo_postal = document.getElementById('codigo_postal')?.value.trim();
            const tipo_envio = document.getElementById('tipo_envio')?.value;
            const metodo_pago = document.getElementById('metodo_pago')?.value;
            const notas = document.getElementById('notas')?.value.trim();

            const carritoData = getCarritoYTotal();
            if (Object.keys(carritoData.carrito).length === 0) {
                alert('❌ Primero elige tus productos.');
                return;
            }

            if (!nombre || !apellido || !email || !telefono || !direccion || !ciudad || !tipo_envio || !metodo_pago) {
                alert('❌ Completa todos los campos obligatorios.');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('❌ Ingresa un email válido.');
                return;
            }

            const ok = await enviarPedido({
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                ciudad,
                region,
                codigo_postal,
                tipo_envio,
                metodo_pago,
                notas,
                detalles: carritoData.detalles,
                total: `S/ ${carritoData.total.toFixed(2)}`
            });

            if (ok) {
                alert('✅ ¡Pedido enviado! Te contactaremos para confirmar.');
                sessionStorage.removeItem('carrito');
                location.reload();
            } else {
                alert('❌ Error al enviar. Intenta de nuevo.');
            }
        });
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const mensaje = document.getElementById('mensaje')?.value.trim();

            if (!nombre || !email || !mensaje) {
                alert('❌ Completa todos los campos.');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('❌ Ingresa un email válido.');
                return;
            }

            const ok = await enviarMensajeContacto({ nombre, email, mensaje });
            if (ok) {
                alert('✅ Mensaje enviado. Te responderemos pronto.');
                contactForm.reset();
            } else {
                alert('❌ Error al enviar. Intenta de nuevo.');
            }
        });
    }
});