import mongoose, { Document, Schema, Model } from 'mongoose';

export enum UnitType {
    KG = "Kg",
    G = "g",
    L = "L",
    CL = "cl",
    ML = "ml",
    NBR = "nbr"
}

export interface IUnitOfMeasurement extends Document {
    name: UnitType;
}
const UnitOfMeasurementSchema = new Schema ({
    name: {
        type: String,
        enum: {
            values: Object.values(UnitType),
            message: "l'unité {VALUE} n'existte pas"
        },
    },
})

const UnitOfMeasurement: Model<IUnitOfMeasurement> = mongoose.model<IUnitOfMeasurement>('unit_of_measurement', UnitOfMeasurementSchema);

export default UnitOfMeasurement;