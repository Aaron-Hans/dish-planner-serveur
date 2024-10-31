import Product from '../models/Product';
import ProductServices from '../services/ProductServices';
import { Request, Response } from 'express';
import { formatedProductName } from '../utils/formatedProductName';

const postProduct = async (req: Request, res: Response): Promise<void> => {
    const { productName } = req.body;
    try {    
        const newProduct = await ProductServices.createProduct(productName)
        res.status(201).json({ message: "Produit créé avec succès", produit: newProduct });
    } catch (error) {
        console.error(error);
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

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const allProducts = await Product.find();
        if (allProducts.length === 0) {
            res.status(404).json({message: "Aucun produit trouvé"});
        } else {
            res.status(200).json(allProducts);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const getProductByName = async (req: Request, res: Response): Promise<void> => {
    let {productName} = req.params;
    productName = formatedProductName(productName);

    try {
        const product = await ProductServices.findProductByName(productName);
        if (!product) {
            res.status(404).json({message: "Produit non trouvé"});           
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { idProduct } = req.params;

    if (!idProduct) {
        res.status(400).json({ message: "L'identifiant du produit est requis." });
        return;
    }

    try {
        const product = await Product.findById(idProduct);

        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }    
};

const putProduct = async (req: Request, res: Response): Promise<void> => {
    let {productId, newProductName} = req.body;

    try {
        const updatedProduct = await ProductServices.updateProduct(productId, newProductName);
        res.status(200).json({ message: "Produit mis à jour avec succès", product: updatedProduct});
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const deleteProductByName = async (req: Request, res: Response): Promise<void> => {
    let {idProduct} = req.params;
        
    try {
        const result = await Product.deleteOne({ _id: idProduct });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `L'ingrédient ${idProduct} n'a pas été trouvé.` });
        } else {
            res.status(200).json({ message: `L'ingrédient ${idProduct} a été supprimé.` });
        }
    } catch (error) {
        console.error('Error:', error);
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
