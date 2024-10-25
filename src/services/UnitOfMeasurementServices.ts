import { error } from "console";
import UnitOfMeasurement, { IUnitOfMeasurement, UnitType } from "../models/UnitOfMeasurement";

const findAllUnitOfMeasurement = async () => {
    return await UnitOfMeasurement.find();
}

const findUnitOfMeasurementByName = async (unitName: UnitType) => {
    return await UnitOfMeasurement.findOne({ name: unitName });
}

const createUnitOfMeasurement = async (unitName: UnitType) => {
    const newUnitOfMeasurement = new UnitOfMeasurement({ name: unitName });
    await newUnitOfMeasurement.save();
    return newUnitOfMeasurement;
}

const findUnitOfMeasurementById = async (idUnit:string): Promise<{unit: IUnitOfMeasurement}> => {
    const unit = await UnitOfMeasurement.findById(idUnit);

    if (!unit) {
        throw error("unité de mesure introuvable");
    }

    return {unit};
}

export default {
    findAllUnitOfMeasurement,
    findUnitOfMeasurementByName,
    createUnitOfMeasurement,
    findUnitOfMeasurementById
}

