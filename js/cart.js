// js/cart.js
import { formatearPrecio } from './utils.js';

let carrito = {};
let productosData = [];

export function initCarrito() {
    const saved = sessionStorage.getItem('carrito');
    if (saved) {
        carrito = JSON.parse(saved);
    }

    fetch('data/productos.json')
        .then(res => res.json())
        .then(data => {
            productosData = data;
            actualizarUI();
        })
        .catch(err => console.error('Error cargando productos:', err));

    // Écouteurs d'événements (délégués)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-mas')) {
            const id = e.target.dataset.id;
            agregarAlCarrito(id);
        }
        if (e.target.classList.contains('btn-menos')) {
            const id = e.target.dataset.id;
            quitarDelCarrito(id);
        }
        if (e.target.classList.contains('btn-mas-pedido')) {
            const id = e.target.dataset.clave;
            agregarAlCarrito(id);
        }
        if (e.target.classList.contains('btn-menos-pedido')) {
            const id = e.target.dataset.clave;
            quitarDelCarrito(id);
        }
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.dataset.clave;
            eliminarDelCarrito(id);
        }
    });
}

function guardarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    const producto = productosData.find(p => p.id == id);
    if (!producto) return;

    if (!carrito[id]) {
        carrito[id] = { cantidad: 0, precio: producto.precio, nombre: producto.nombre };
    }
    carrito[id].cantidad++;
    guardarCarrito();
    actualizarUI();
}

function quitarDelCarrito(id) {
    if (carrito[id] && carrito[id].cantidad > 0) {
        carrito[id].cantidad--;
        if (carrito[id].cantidad === 0) delete carrito[id];
        guardarCarrito();
        actualizarUI();
    }
}

function eliminarDelCarrito(id) {
    delete carrito[id];
    guardarCarrito();
    actualizarUI();
}

function actualizarUI() {
    // Mettre à jour les compteurs sur les produits
    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.dataset.id;
        const span = card.querySelector('.cantidad');
        if (span) span.textContent = carrito[id]?.cantidad || 0;
    });

    const listaPedido = document.getElementById('lista-pedido');
    const totalSpan = document.getElementById('total');
    const pedidoVacio = document.getElementById('pedido-vacio');
    const pedidoContenido = document.getElementById('pedido-contenido');

    if (!listaPedido) return;

    let total = 0;
    let itemsHtml = '';

    for (let id in carrito) {
        const item = carrito[id];
        const subtotal = item.cantidad * item.precio;
        total += subtotal;
        itemsHtml += `
            <li>
                <div class="cart-item-row">
                    <span class="cart-item-name">${item.nombre}</span>
                    <span class="cart-item-price">${formatearPrecio(subtotal)}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-mini-controls">
                        <button class="btn-menos-pedido" data-clave="${id}">−</button>
                        <span class="cantidad-pedido">${item.cantidad}</span>
                        <button class="btn-mas-pedido" data-clave="${id}">+</button>
                    </div>
                    <button class="btn-eliminar" data-clave="${id}">🗑️</button>
                </div>
            </li>
        `;
    }

    if (itemsHtml === '') {
        if (pedidoVacio) pedidoVacio.style.display = 'block';
        if (pedidoContenido) pedidoContenido.style.display = 'none';
    } else {
        if (pedidoVacio) pedidoVacio.style.display = 'none';
        if (pedidoContenido) pedidoContenido.style.display = 'block';
        listaPedido.innerHTML = itemsHtml;
        if (totalSpan) totalSpan.textContent = formatearPrecio(total);
    }
}

export function getCarritoYTotal() {
    let total = 0;
    const detalles = [];
    for (let id in carrito) {
        const item = carrito[id];
        const subtotal = item.cantidad * item.precio;
        total += subtotal;
        detalles.push(`${item.nombre} x${item.cantidad} = ${formatearPrecio(subtotal)}`);
    }
    return { carrito, total, detalles };
}