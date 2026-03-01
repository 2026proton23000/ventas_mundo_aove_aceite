// js/products.js
import { formatearPrecio } from './utils.js';

export async function cargarProductos() {
    try {
        const response = await fetch('data/productos.json');
        const productos = await response.json();
        const container = document.getElementById('productos-grid');
        if (!container) return;

        container.innerHTML = productos.map(producto => `
            <div class="product-card" data-id="${producto.id}" data-precio="${producto.precio}" data-nombre="${producto.nombre}" data-desc="${producto.descripcion}">
                <div class="product-image" style="background-image: url('images/productos/${producto.imagen}');"></div>
                <div class="product-content">
                    <div class="product-name">
                        ${producto.nombre}
                        ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ''}
                    </div>
                    <p class="product-desc">${producto.descripcion}</p>
                    <div class="product-footer">
                        <span class="product-price">${formatearPrecio(producto.precio)}</span>
                        <div class="quantity-control">
                            <button class="btn-menos" data-id="${producto.id}">−</button>
                            <span class="cantidad" data-id="${producto.id}">0</span>
                            <button class="btn-mas" data-id="${producto.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}