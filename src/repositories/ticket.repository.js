import Ticket from '../models/ticket.model.js';

/**
 * Repository para operaciones de Tickets
 */
export class TicketRepository {
    
    async findById(id) {
        return await Ticket.findById(id).populate('products.productId failedProducts.productId');
    }

    async findByCode(code) {
        return await Ticket.findOne({ code }).populate('products.productId failedProducts.productId');
    }

    async findAll(query = {}, options = {}) {
        return await Ticket.find(query, null, options).populate('products.productId failedProducts.productId');
    }

    async findByPurchaser(email, options = {}) {
        return await Ticket.find({ purchaser: email }, null, options).populate('products.productId failedProducts.productId');
    }

    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async update(id, ticketData) {
        return await Ticket.findByIdAndUpdate(id, ticketData, { new: true }).populate('products.productId failedProducts.productId');
    }

    async delete(id) {
        return await Ticket.findByIdAndDelete(id);
    }

    async generateUniqueCode() {
        let code;
        let exists = true;
        
        while (exists) {
            code = `TICK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            exists = await Ticket.findOne({ code });
        }
        
        return code;
    }
}

export default new TicketRepository();
