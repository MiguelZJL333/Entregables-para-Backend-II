import cartService from '../services/cart.service.js';
import checkoutService from '../services/checkout.service.js';
import { sendPurchaseConfirmationEmail } from '../utils/mailer.js';

/**
 * Obtiene el carrito del usuario
 */
export const getCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;

        const cart = await cartService.getCart(cartId);
        const total = await cartService.getCartTotal(cart);

        res.status(200).json({
            status: 'success',
            payload: {
                _id: cart._id,
                products: cart.products,
                total: total
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Agregar producto al carrito
 */
export const addProductToCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'productId es requerido'
            });
        }

        const updatedCart = await cartService.addProductToCart(
            cartId,
            productId,
            parseInt(quantity)
        );

        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Producto agregado al carrito',
            payload: {
                _id: updatedCart._id,
                products: updatedCart.products,
                total: total
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar cantidad de producto en el carrito
 */
export const updateProductQuantity = async (req, res, next) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cantidad debe ser mayor a 0'
            });
        }

        const updatedCart = await cartService.updateProductQuantity(
            cartId,
            productId,
            parseInt(quantity)
        );

        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Cantidad actualizada',
            payload: {
                _id: updatedCart._id,
                products: updatedCart.products,
                total: total
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un producto del carrito
 */
export const removeProductFromCart = async (req, res, next) => {
    try {
        const { cartId, productId } = req.params;

        const updatedCart = await cartService.removeProductFromCart(cartId, productId);

        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito',
            payload: {
                _id: updatedCart._id,
                products: updatedCart.products,
                total: total
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Vacía el carrito
 */
export const clearCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;

        const clearedCart = await cartService.clearCart(cartId);

        res.status(200).json({
            status: 'success',
            message: 'Carrito vaciado',
            payload: {
                _id: clearedCart._id,
                products: []
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Procesa la compra del carrito
 */
export const purchaseCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const userEmail = req.user.email || req.body.email;

        if (!userEmail) {
            return res.status(400).json({
                status: 'error',
                message: 'Email requerido para procesar la compra'
            });
        }

        // Procesar compra
        const ticket = await checkoutService.purchaseCart(cartId, userEmail);

        // Enviar email de confirmación
        try {
            await sendPurchaseConfirmationEmail(userEmail, ticket);
        } catch (emailError) {
            console.error('Error al enviar email de confirmación:', emailError);
            // No fallar la compra si el email falla
        }

        res.status(201).json({
            status: 'success',
            message: 'Compra procesada exitosamente',
            payload: {
                ticket: ticket._id,
                code: ticket.code,
                amount: ticket.amount,
                products: ticket.products.length,
                failedProducts: ticket.failedProducts.length,
                status: ticket.status
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene un ticket por ID
 */
export const getTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params;

        const ticket = await checkoutService.getTicket(ticketId);

        res.status(200).json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        next(error);
    }
};
