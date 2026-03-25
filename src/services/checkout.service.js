import ticketRepository from '../repositories/ticket.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import cartService from './cart.service.js';

/**
 * Service para lógica de Checkout y Órdenes de Compra
 */
export class CheckoutService {

    async purchaseCart(cartId, userEmail) {
        // Obtener carrito
        const cart = await cartRepository.findById(cartId);
        if (!cart || !cart.products || cart.products.length === 0) {
            throw new Error('Carrito vacío o no encontrado');
        }

        // Validar y procesar productos
        const validatedProducts = await cartService.validateCartProducts(cart);

        if (validatedProducts.validProducts.length === 0) {
            throw new Error('No hay productos válidos para comprar');
        }

        // Generar código de ticket
        const ticketCode = await ticketRepository.generateUniqueCode();

        // Crear ticket
        const ticketData = {
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: validatedProducts.total,
            purchaser: userEmail,
            products: validatedProducts.validProducts,
            failedProducts: validatedProducts.invalidProducts,
            status: validatedProducts.invalidProducts.length > 0 ? 'partial' : 'completed'
        };

        const ticket = await ticketRepository.create(ticketData);

        // Actualizar stock solo de productos válidos
        for (const product of validatedProducts.validProducts) {
            await productRepository.decreaseStock(product.productId, product.quantity);
        }

        // Limpiar carrito
        await cartRepository.clear(cartId);

        return ticket;
    }

    async getTicket(ticketId) {
        const ticket = await ticketRepository.findById(ticketId);
        if (!ticket) throw new Error('Ticket no encontrado');
        return ticket;
    }

    async getTicketByCode(code) {
        const ticket = await ticketRepository.findByCode(code);
        if (!ticket) throw new Error('Ticket no encontrado');
        return ticket;
    }

    async getUserTickets(userEmail) {
        return await ticketRepository.findByPurchaser(userEmail, { sort: { createdAt: -1 } });
    }

    async getAllTickets(options = {}) {
        return await ticketRepository.findAll({}, options);
    }
}

export default new CheckoutService();
