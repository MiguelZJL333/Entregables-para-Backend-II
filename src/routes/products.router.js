import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';

const productsRouter = express.Router();

/*----------------------------GET--------------------------------*/
// Obtener todos los productos (público)
productsRouter.get('/', getAllProducts);

// Obtener un producto por ID (público)
productsRouter.get('/:pid', getProductById);

/*----------------------------POST--------------------------------*/
// Crear un nuevo producto (solo admin)
productsRouter.post('/', authMiddleware, adminOnly, addProduct);

/*---------------------------PUT--------------------------------*/
// Actualizar un producto existente (solo admin)
productsRouter.put('/:pid', authMiddleware, adminOnly, updateProduct);

/*----------------------------DELETE--------------------------------*/
// Eliminar un producto (solo admin)
productsRouter.delete('/:pid', authMiddleware, adminOnly, deleteProduct);

export default productsRouter;