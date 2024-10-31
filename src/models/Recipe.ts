import mongoose, { Document, Schema, Model } from 'mongoose';
import { IIngredient } from './Ingredient';

export interface IRecipe extends Document{
    name: String,
    ingredient: IIngredient[],
}

const RecipeSchema: Schema = new Schema({
    name:{type: String, require: true},
    ingredient: [{type: mongoose.Schema.Types.ObjectId, ref: 'ingredients', require: true}],
})

const Recipe: Model<IRecipe> = mongoose.model<IRecipe>('recipe', RecipeSchema);

export default Recipe;