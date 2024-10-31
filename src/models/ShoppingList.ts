import mongoose, {Document, Schema, Model} from "mongoose";
import { IIngredient } from "./Ingredient";
import { IRecipe } from "./Recipe";


export interface IShoppingList extends Document {
    name: string;
    ingredient: IIngredient[];
    recipe: IRecipe[];
}

const ShoppingListSchema = new Schema({
    name: {type: String, required: true},
    ingredient: [{type: mongoose.Schema.Types.ObjectId, ref: 'ingredients'}],
    recipe: [{type: mongoose.Schema.Types.ObjectId, ref: 'recipe'}],
})

const ShoppingList: Model<IShoppingList> = mongoose.model<IShoppingList>('shopping_list', ShoppingListSchema);

export default ShoppingList;