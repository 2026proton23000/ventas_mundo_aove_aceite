// js/utils.js

/**
 * Formate un prix en soles péruviens
 * @param {number} precio - Le prix à formater
 * @returns {string} Prix formaté (ex: S/ 35.00)
 */
export function formatearPrecio(precio) {
    return `S/ ${precio.toFixed(2)}`;
}

/**
 * Génère un identifiant unique pour un visiteur
 * @returns {string} ID unique
 */
export function generarIdUnico() {
    return 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
}

/**
 * Affiche une notification simple (peut être améliorée)
 * @param {string} mensaje - Message à afficher
 * @param {string} tipo - 'success' ou 'error'
 */
export function mostrarNotificacion(mensaje, tipo = 'success') {
    alert(mensaje); // Version simple, on pourra améliorer plus tard
}