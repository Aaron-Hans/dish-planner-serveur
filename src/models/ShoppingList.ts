import mongoose, {Document, Schema, Model} from "mongoose";
import { INumberOfIngredient } from "./NumberOfIngredient";
import { INumberOfDish } from "./NumberOfDish";

export enum ShoppingListAction {
    CREATE = "new",
    ADD_ONE = "add",
    REMOVE_ONE = "remove"
}


export interface IShoppingList extends Document {
    name: string;
    ingredient: INumberOfIngredient[];
    dish: INumberOfDish[];
    action: ShoppingListAction;
}

const ShoppingListSchema = new Schema({
    name: {type: String, required: true},
    ingredient: [{type: mongoose.Schema.Types.ObjectId, ref: 'number_of_ingredients'}],
    dish: [{type: mongoose.Schema.Types.ObjectId, ref: 'number_of_dish'}],
    action: {
        type: String,
        enum: {
            values: Object.values(ShoppingListAction),
            message: "Action inéxistante"
        },
    },
})

const ShoppingList: Model<IShoppingList> = mongoose.model<IShoppingList>('shopping_list', ShoppingListSchema);

export default ShoppingList;