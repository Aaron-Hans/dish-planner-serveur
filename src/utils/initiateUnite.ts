import { UnitType } from "../models/UnitOfMeasurement";

export const initiateUnite = (quantity: number,unitOfMeasurement: UnitType) => {
    let restOfQuantity : number = 0;
    if (unitOfMeasurement === UnitType.G && quantity >= 1000) {
        quantity = quantity / 1000;
        unitOfMeasurement = UnitType.KG;
    } else if (unitOfMeasurement === UnitType.ML) {
        if (quantity >= 1000) {
            restOfQuantity = restOfQuantity % quantity
            if (restOfQuantity > 0) {
                quantity = quantity / 1000;
                quantity = quantity,restOfQuantity                
            }
            quantity = quantity / 1000;
            unitOfMeasurement = UnitType.L;
        } else if (quantity >= 10) {
            quantity = quantity / 10;
            unitOfMeasurement = UnitType.CL;
        }
    } else if (unitOfMeasurement === UnitType.CL && quantity >= 100) {
        restOfQuantity = restOfQuantity % quantity
        if (restOfQuantity > 0) {
            quantity = quantity / 100;
            quantity = quantity,restOfQuantity                
        }
        quantity = quantity / 100;
        unitOfMeasurement = UnitType.L;
    }

    return {quantity, unitOfMeasurement};
}
