import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document{
    name: string;
}

const Productchema = new Schema({
    name: {type: String, unique: true, required: true},    
})



const Product: Model<IProduct> = mongoose.model<IProduct>('products', Productchema);

export default Product;