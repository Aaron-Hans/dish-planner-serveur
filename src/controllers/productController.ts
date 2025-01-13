import Product from '../models/Product';
import ProductServices from '../services/ProductServices';
import { Request, Response } from 'express';
import { formatedProductName } from '../utils/formatedProductName';
import logger from '../config/logger';

/**
 * Creates a new product
 * @param req - Express Request object containing productName in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 201 with created product or error status codes
 */
const postProduct = async (req: Request, res: Response): Promise<void> => {
    const { productName } = req.body;
    logger.debug('Attempting to create product', { productName });
    try {    
        const newProduct = await ProductServices.createProduct(productName)
        logger.info('Product created successfully', { productId: newProduct._id });
        res.status(201).json({ message: "Produit créé avec succès", produit: newProduct });
    } catch (error) {
        logger.error('Error creating product:', error);
        if (error instanceof Error) {
            if (error.name === 'MongoError' && 'code' in error && error.code === 11000) {
                res.status(409).json({ message: "Erreur : ce produit existe déjà." });
            } else {
                res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
            }
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

/**
 * Retrieves all products from the database
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with products array or 404 if none found
 */
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    logger.debug('Attempting to retrieve all products');
    try {
        const allProducts = await Product.find();
        if (allProducts.length === 0) {
            logger.info('No products found');
            res.status(404).json({message: "Aucun produit trouvé"});
        } else {
            logger.info('Products retrieved successfully', { count: allProducts.length });
            res.status(200).json(allProducts);
        }
    } catch (error) {
        logger.error('Error retrieving products:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

/**
 * Retrieves a product by its name
 * @param req - Express Request object containing productName in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with product or 404 if not found
 */
const getProductByName = async (req: Request, res: Response): Promise<void> => {
    let {productName} = req.params;
    productName = formatedProductName(productName);
    logger.debug('Attempting to find product by name', { productName });

    try {
        const product = await ProductServices.findProductByName(productName);
        if (!product) {
            logger.info('Product not found', { productName });
            res.status(404).json({message: "Produit non trouvé"});           
        } else {
            logger.info('Product found successfully', { productId: product._id });
            res.status(200).json(product);
        }
    } catch (error) {
        logger.error('Error finding product by name:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

/**
 * Retrieves a product by its ID
 * @param req - Express Request object containing idProduct in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with product or 404 if not found
 */
const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { idProduct } = req.params;
    logger.debug('Attempting to find product by ID', { idProduct });

    if (!idProduct) {
        logger.warn('Product ID not provided');
        res.status(400).json({ message: "L'identifiant du produit est requis." });
        return;
    }

    try {
        const product = await Product.findById(idProduct);

        if (!product) {
            logger.info('Product not found', { idProduct });
            res.status(404).json({ message: "Produit non trouvé" });
        } else {
            logger.info('Product found successfully', { productId: product._id });
            res.status(200).json(product);
        }
    } catch (error) {
        logger.error('Error finding product by ID:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }    
};

/**
 * Updates a product's name
 * @param req - Express Request object containing productId and newProductName in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with updated product or error status
 */
const putProduct = async (req: Request, res: Response): Promise<void> => {
    let {productId, newProductName} = req.body;
    logger.debug('Attempting to update product', { productId, newProductName });

    try {
        const updatedProduct = await ProductServices.updateProduct(productId, newProductName);
        logger.info('Product updated successfully', { productId });
        res.status(200).json({ message: "Produit mis à jour avec succès", product: updatedProduct});
    } catch (error) {
        logger.error('Error updating product:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

/**
 * Deletes a product by its ID
 * @param req - Express Request object containing idProduct in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 on successful deletion or 404 if not found
 */
const deleteProductByName = async (req: Request, res: Response): Promise<void> => {
    let {idProduct} = req.params;
    logger.debug('Attempting to delete product', { idProduct });
        
    try {
        const result = await Product.deleteOne({ _id: idProduct });
        if (result.deletedCount === 0) {
            logger.info('Product not found for deletion', { idProduct });
            res.status(404).json({ message: `L'ingrédient ${idProduct} n'a pas été trouvé.` });
        } else {
            logger.info('Product deleted successfully', { idProduct });
            res.status(200).json({ message: `L'ingrédient ${idProduct} a été supprimé.` });
        }
    } catch (error) {
        logger.error('Error deleting product:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const productController = {
    postProduct,
    putProduct,
    getAllProducts,
    getProductByName,
    getProductById,
    deleteProductByName
};

export default productController;
