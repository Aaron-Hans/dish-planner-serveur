import mongoose, {Document, Schema, Model} from "mongoose";
import { IIngredient } from "./Ingredient";
import { IUnitOfMeasurement } from "./UnitOfMeasurement";

export interface INumberOfIngredient extends Document {
    ingredient: IIngredient;
    unitOfMeasurement: IUnitOfMeasurement;
    quantity: Number;
}

const NumberOfIngredientsSchema = new Schema({
    ingredient: {type: mongoose.Schema.Types.ObjectId, ref: 'ingredients', require: true},
    unitOfMeasurement: {type: mongoose.Schema.Types.ObjectId, ref: 'unit_of_measurement', require: true},
    quantity: {type: Number, require: true}
});

const NumberOfIngredients: Model<INumberOfIngredient> = mongoose.model<INumberOfIngredient>('number_of_ingredients',NumberOfIngredientsSchema);

export default NumberOfIngredients;
