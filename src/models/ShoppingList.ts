import mongoose, {Document, Schema, Model} from "mongoose";
import { INumberOfIngredient } from "./NumberOfIngredient";
import { IDishes } from "./Dishes";


export interface IShoppingList extends Document {
    name: string;
    ingredient: INumberOfIngredient[];
    dish: IDishes[];
}

const ShoppingListSchema = new Schema({
    name: {type: String, required: true},
    ingredient: [{type: mongoose.Schema.Types.ObjectId, ref: 'number_of_ingredients'}],
    dish: [{type: mongoose.Schema.Types.ObjectId, ref: 'dishes'}],
})

const ShoppingList: Model<IShoppingList> = mongoose.model<IShoppingList>('shopping_list', ShoppingListSchema);

export default ShoppingList;