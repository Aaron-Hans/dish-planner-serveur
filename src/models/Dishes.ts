import mongoose, { Document, Schema, Model } from 'mongoose';
import { INumberOfIngredient } from './NumberOfIngredient';

export interface IDishes extends Document{
    name: String,
    ingredient: INumberOfIngredient[],
    numberOfPerson: number,  
}

const DishesSchema: Schema = new Schema({
    name:{type: String, require: true},
    ingredient: [{type: mongoose.Schema.Types.ObjectId, ref: 'number_of_ingredients', require: true}],
    numberOfPerson:{type: Number, default: 2}
})

const Dishes: Model<IDishes> = mongoose.model<IDishes>('dishes', DishesSchema);

export default Dishes;