import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true,
            // Formato: TICK-{timestamp-random}
        },
        purchase_datetime: {
            type: Date,
            default: Date.now,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        purchaser: {
            type: String,
            required: true, // Email del comprador
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required: true,
                },
                title: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
            },
        ],
        failedProducts: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                title: String,
                requestedQuantity: Number,
                availableStock: Number,
                reason: String,
            },
        ],
        status: {
            type: String,
            enum: ['completed', 'partial'],
            default: 'completed',
        },
    },
    { timestamps: true }
);

const Ticket = mongoose.model('tickets', ticketSchema);

export default Ticket;
