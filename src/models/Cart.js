async function ensureCartId() {
    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
        try {
            const res = await fetch('/api/carts', { method: 'POST' });
            if (!res.ok) throw new Error('Error al crear carrito');
            const data = await res.json();

            cartId = data.cart?.id || data.id;

            if (!cartId) throw new Error('Respuesta inválida al crear carrito');

            localStorage.setItem('cartId', cartId);
            console.log('🛒 Nuevo carrito creado:', cartId);

            return cartId;
        } catch (err) {
            console.error('❌ Error creando carrito:', err);
            return null;
        }
    }

    console.log('🔁 Usando carrito existente:', cartId);
    return cartId;
}

async function fetchCart() {
    const cartId = await ensureCartId();

    if (!cartId) {
        console.warn('⚠️ No se pudo obtener un cartId válido.');
        return;
    }

    try {
        const res = await fetch(`/api/carts/${cartId}`);
        if (!res.ok) {
            throw new Error(`Carrito ${cartId} no encontrado`);
        }

        const cart = await res.json();
        console.log('🛍 Contenido del carrito:', cart);
        renderCart(cart);
    } catch (err) {
        console.error('❌ Error al obtener el carrito:', err);
    }
}

function renderCart(cart) {
    const container = document.getElementById('cart-container');
    if (!container || !cart.products) return;

    container.innerHTML = cart.products.map(item => `
        <div>
            <strong>${item.product}</strong> x ${item.quantity}
        </div>
    `).join('');
}

window.addEventListener('DOMContentLoaded', fetchCart);
