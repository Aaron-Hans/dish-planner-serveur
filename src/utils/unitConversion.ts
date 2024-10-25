import { UnitType } from "../models/UnitOfMeasurement";

export const measurmentConvertor = (quantity: number, unitOfMeasurement: UnitType, targetUnit: UnitType): { quantity: number, unit: UnitType } => {

    if (unitOfMeasurement === UnitType.G && targetUnit === UnitType.KG) {
        return { quantity: quantity / 1000, unit: UnitType.KG };
    } else if (unitOfMeasurement === UnitType.KG && targetUnit === UnitType.G) {
        return { quantity: quantity * 1000, unit: UnitType.G };
    }

    if (unitOfMeasurement === UnitType.ML) {
        if (targetUnit === UnitType.L) {
            return { quantity: quantity / 1000, unit: UnitType.L };
        } else if (targetUnit === UnitType.CL) {
            return { quantity: quantity / 10, unit: UnitType.CL };
        }
    } else if (unitOfMeasurement === UnitType.L) {
        if (targetUnit === UnitType.ML) {
            return { quantity: quantity * 1000, unit: UnitType.ML };
        } else if (targetUnit === UnitType.CL) {
            return { quantity: quantity * 100, unit: UnitType.CL };
        }
    } else if (unitOfMeasurement === UnitType.CL) {
        if (targetUnit === UnitType.ML) {
            return { quantity: quantity * 10, unit: UnitType.ML };
        } else if (targetUnit === UnitType.L) {
            return { quantity: quantity / 100, unit: UnitType.L };
        }
    }

    return { quantity, unit: unitOfMeasurement };
}