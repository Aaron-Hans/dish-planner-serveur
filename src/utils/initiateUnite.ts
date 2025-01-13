import { UnitType } from "../models/Ingredient";
import logger from "../config/logger";

/**
 * Converts a quantity and unit of measurement to a more appropriate unit
 * For example, converts 1000g to 1kg or 1000ml to 1L
 * @param quantity - The numeric quantity to convert
 * @param unitOfMeasurement - The unit of measurement (NBR, G, KG, ML, CL, L)
 * @returns {quantity: number, unitOfMeasurement: UnitType} - The converted quantity and unit
 */
export const initiateUnite = (quantity: number, unitOfMeasurement: UnitType) => {
    logger.debug("Starting unit conversion", { quantity, unitOfMeasurement });
    
    let restOfQuantity : number = 0;
    
    if (unitOfMeasurement === UnitType.NBR) {
        logger.debug("Unit is NBR, no conversion needed", { quantity, unitOfMeasurement });
        return {quantity, unitOfMeasurement}
    }

    if (unitOfMeasurement === UnitType.G && quantity >= 1000) {
        quantity = quantity / 1000;
        unitOfMeasurement = UnitType.KG;
        logger.debug("Converted grams to kilograms", { newQuantity: quantity, newUnit: unitOfMeasurement });
    } else if (unitOfMeasurement === UnitType.ML) {
        if (quantity >= 1000) {
            restOfQuantity = restOfQuantity % quantity
            if (restOfQuantity > 0) {
                quantity = quantity / 1000;
                quantity = quantity,restOfQuantity                
            }
            quantity = quantity / 1000;
            unitOfMeasurement = UnitType.L;
            logger.debug("Converted milliliters to liters", { newQuantity: quantity, newUnit: unitOfMeasurement });
        } else if (quantity >= 10) {
            quantity = quantity / 10;
            unitOfMeasurement = UnitType.CL;
            logger.debug("Converted milliliters to centiliters", { newQuantity: quantity, newUnit: unitOfMeasurement });
        }
    } else if (unitOfMeasurement === UnitType.CL && quantity >= 100) {
        restOfQuantity = restOfQuantity % quantity
        if (restOfQuantity > 0) {
            quantity = quantity / 100;
            quantity = quantity,restOfQuantity                
        }
        quantity = quantity / 100;
        unitOfMeasurement = UnitType.L;
        logger.debug("Converted centiliters to liters", { newQuantity: quantity, newUnit: unitOfMeasurement });
    }

    logger.debug("Unit conversion complete", { finalQuantity: quantity, finalUnit: unitOfMeasurement });
    return {quantity, unitOfMeasurement};
}
