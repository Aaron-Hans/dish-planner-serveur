import mongoose, { Document, Schema, Model } from 'mongoose';
import { IDishes } from './Dishes';

export interface INumberOfDish extends Document {
    dish: IDishes,
    numberOfDish: number,
}

const NumberOfDishSchema = new Schema ({
    dish: {type: mongoose.Schema.Types.ObjectId, ref: 'dishes', require: true},
    numberOfDish: {type: Number, require: true}
})

const NumberOfDish: Model<INumberOfDish> = mongoose.model<INumberOfDish>('number_of_dish', NumberOfDishSchema);

export default NumberOfDish;