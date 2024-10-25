import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IIngredient extends Document{
    name: string;
}

const IngrediantsSchema = new Schema({
    name: {type: String, unique: true, required: true},    
})



const Ingredient: Model<IIngredient> = mongoose.model<IIngredient>('ingredients', IngrediantsSchema);

export default Ingredient;