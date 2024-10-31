import Product, { IProduct } from '../models/Product';
import { formatedProductName } from '../utils/formatedProductName';

const createProduct = async (productName: string): Promise<IProduct> => {
    if (!productName) {
        throw new Error("impossible de créer un produit sans le nom")
    }
    productName = formatedProductName(productName);
    const newProduct: IProduct = new Product({ name: productName });
    await newProduct.save();

    return newProduct;
}

const findProductByName = async (productName: string): Promise<IProduct> => {
    const formattedProductName = formatedProductName(productName);
    const product =  await Product.findOne({ name: formattedProductName});
    if (!product) {
        throw new Error("produit introuvable")
    }
    return product
}

const updateProduct = async (productId: string, newProductName: string):Promise<IProduct> => {
    const product = await Product.findById(productId);
    newProductName = formatedProductName(newProductName);

    
    if (!product) {
        throw new Error("Produit introuvable")
    }
    
    await product.updateOne(
        {name: newProductName},
        { new: true })

    return product;
}

const findProductById = async (idProduct:string): Promise<IProduct> => {
    const product = await Product.findById(idProduct);
    if (!product) {
        throw new Error("produit introuvable");
    }
    return product
}




export default{createProduct, findProductByName, findProductById, updateProduct}
