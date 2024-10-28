import UnitOfMeasurement, { IUnitOfMeasurement, UnitType } from "../models/UnitOfMeasurement";

const findAllUnitOfMeasurement = async (): Promise<IUnitOfMeasurement[]> => {
    const allUnits = await UnitOfMeasurement.find();
    if (allUnits.length === 0) {
        throw new Error("Aucune unité de mesure trouvée");
    }
    return allUnits;
}

const findUnitOfMeasurementByName = async (unitName: UnitType): Promise<IUnitOfMeasurement> => {
    const unit = await UnitOfMeasurement.findOne({ name: unitName });

    if (!unit) {
        throw new Error("unité de mesure introuvable");
    }

    return unit;
}

const createUnitOfMeasurement = async (unitName: UnitType): Promise<IUnitOfMeasurement> => {
    const newUnitOfMeasurement = new UnitOfMeasurement({ name: unitName });
    await newUnitOfMeasurement.save();
    return newUnitOfMeasurement;
}

const findUnitOfMeasurementById = async (idUnit:string): Promise<IUnitOfMeasurement> => {
    const unit = await UnitOfMeasurement.findById(idUnit);

    if (!unit) {
        throw new Error("unité de mesure introuvable");
    }

    return unit;
}

export default {
    findAllUnitOfMeasurement,
    findUnitOfMeasurementByName,
    createUnitOfMeasurement,
    findUnitOfMeasurementById
}

