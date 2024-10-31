import mongoose, {Document, Schema, Model} from "mongoose";
import { IProduct } from "./Product";

export enum UnitType {
    KG = "Kg",
    G = "g",
    L = "L",
    CL = "cl",
    ML = "ml",
    NBR = "nbr"
}


export interface IIngredient extends Document {
    product: IProduct;
    unit: UnitType;
    quantity: Number;
}

const IngredientSchema = new Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'products', require: true},
    unit: {
        type: String,
        enum: {
            values: Object.values(UnitType),
            message: "l'unité {VALUE} n'existte pas"
        },
    },
    quantity: {type: Number, require: true}
});

const Ingredient: Model<IIngredient> = mongoose.model<IIngredient>('ingredients',IngredientSchema);

export default Ingredient;
