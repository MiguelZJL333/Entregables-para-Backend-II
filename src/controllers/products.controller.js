import productService from '../services/product.service.js';
import { ProductDTO, CreateProductDTO } from '../dtos/product.dto.js';

/**
 * Obtiene todos los productos con paginación
 */
export const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = -1 } = req.query;

        const products = await productService.getProducts(
            {},
            {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: { createdAt: parseInt(sort) }
            }
        );

        const response = {
            status: 'success',
            docs: products.docs.map(p => new ProductDTO(p)),
            totalDocs: products.totalDocs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;

        const product = await productService.getProductById(pid);

        res.status(200).json({
            status: 'success',
            payload: new ProductDTO(product)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Crear un nuevo producto (solo admin)
 */
export const addProduct = async (req, res, next) => {
    try {
        const productData = new CreateProductDTO(req.body);

        const newProduct = await productService.createProduct(productData);

        res.status(201).json({
            status: 'success',
            message: 'Producto creado correctamente',
            payload: new ProductDTO(newProduct)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar un producto (solo admin)
 */
export const updateProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;

        const updatedProduct = await productService.updateProduct(pid, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Producto actualizado correctamente',
            payload: new ProductDTO(updatedProduct)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar un producto (solo admin)
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;

        const deletedProduct = await productService.deleteProduct(pid);

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado correctamente',
            payload: new ProductDTO(deletedProduct)
        });
    } catch (error) {
        next(error);
    }
};




