import Product, { IProduct } from '../models/Product';
import { formatedProductName } from '../utils/formatedProductName';
import logger from '../config/logger';

/**
 * Creates a new product in the database
 * @param productName - The name of the product to create
 * @returns Promise<IProduct> - The newly created product
 */
const createProduct = async (productName: string): Promise<IProduct> => {
    if (!productName) {
        logger.error("Cannot create product without name");
        throw new Error("impossible de créer un produit sans le nom")
    }
    productName = formatedProductName(productName);
    const newProduct: IProduct = new Product({ name: productName });
    await newProduct.save();
    logger.info("Product created successfully", {productName});
    return newProduct;
}

/**
 * Finds a product by its name
 * @param productName - The name of the product to find
 * @returns Promise<IProduct> - The found product
 */
const findProductByName = async (productName: string): Promise<IProduct> => {
    const formattedProductName = formatedProductName(productName);
    const product = await Product.findOne({ name: formattedProductName});
    if (!product) {
        logger.error("Product not found", {productName});
        throw new Error("produit introuvable")
    }
    logger.info("Product found by name", {productName});
    return product
}

/**
 * Updates a product's name
 * @param productId - The ID of the product to update
 * @param newProductName - The new name for the product
 * @returns Promise<IProduct> - The updated product
 */
const updateProduct = async (productId: string, newProductName: string):Promise<IProduct> => {
    const product = await Product.findById(productId);
    newProductName = formatedProductName(newProductName);
    
    if (!product) {
        logger.error("Product not found for update", {productId});
        throw new Error("Produit introuvable")
    }
    
    await product.updateOne(
        {name: newProductName},
        { new: true })
    
    logger.info("Product updated successfully", {productId, newProductName});
    return product;
}

/**
 * Finds a product by its ID
 * @param idProduct - The ID of the product to find
 * @returns Promise<IProduct> - The found product
 */
const findProductById = async (idProduct:string): Promise<IProduct> => {
    const product = await Product.findById(idProduct);
    if (!product) {
        logger.error("Product not found", {idProduct});
        throw new Error("produit introuvable");
    }
    logger.info("Product found by ID", {idProduct});
    return product
}

export default{createProduct, findProductByName, findProductById, updateProduct}
