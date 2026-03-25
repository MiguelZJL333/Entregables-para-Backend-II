import ProductModel from '../models/product.model.js';

/**
 * Repository para operaciones de Producto
 */
export class ProductRepository {
    
    async findById(id) {
        return await ProductModel.findById(id);
    }

    async findByCode(code) {
        return await ProductModel.findOne({ code: code.toUpperCase() });
    }

    async findAll(query = {}, options = {}) {
        return await ProductModel.paginate(query, options);
    }

    async create(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async update(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }

    async updateStock(id, quantity) {
        return await ProductModel.findByIdAndUpdate(
            id,
            { $inc: { stock: -quantity } },
            { new: true }
        );
    }

    async decreaseStock(id, quantity) {
        return await ProductModel.findByIdAndUpdate(
            id,
            { $inc: { stock: -quantity } },
            { new: true }
        );
    }

    async findByIdMultiple(ids) {
        return await ProductModel.find({ _id: { $in: ids } });
    }
}

export default new ProductRepository();
