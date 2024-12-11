import Product, { IProduct } from '../models/Product';
import { formatedProductName } from '../utils/formatedProductName';

const createProduct = async (productName: string): Promise<void> => {
    if (!productName) {
        throw new Error("impossible de créer un produit sans le nom")
    }
    productName = formatedProductName(productName);
    const newProduct: IProduct = new Product({ name: productName });
    await newProduct.save();
}

const findProductByName = async (productName: string): Promise<IProduct> => {
    const formattedProductName = formatedProductName(productName);
    const product =  await Product.findOne({ name: formattedProductName});
    if (!product) {
        throw new Error("produit introuvable")
    }
    return product
}

const findProductById = async (idProduct:string): Promise<IProduct> => {
    const product = await Product.findById(idProduct);
    if (!product) {
        throw new Error("produit introuvable");
    }
    return product
}




export default{createProduct, findProductByName, findProductById}
