/**
 * DTO para Productos
 */
export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
        this.thumbnails = product.thumbnails;
    }
}

/**
 * DTO para crear/actualizar productos (solo admin)
 */
export class CreateProductDTO {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.code = data.code;
        this.price = data.price;
        this.stock = data.stock;
        this.category = data.category;
        this.thumbnails = data.thumbnails || null;
    }
}
