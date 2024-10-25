import { error } from 'console';
import Ingredient from '../models/Ingredient';
import NumberOfIngredients, { INumberOfIngredient } from '../models/NumberOfIngredient';
import UnitOfMeasurement from '../models/UnitOfMeasurement';
import { initiateUnite } from '../utils/initiateUnite';

const newNumberOfIngredients = async (ingredientId: string, unitId: string, quantity: number) => {
    const ingredient = await Ingredient.findById(ingredientId);
    const unit = await UnitOfMeasurement.findById(unitId);

    console.log(unit);

    if (!unit || !unit._id) {
        console.log("Unité non trouvée");
        return null;
    }
    if (!ingredient || !ingredient._id) {
        console.log("Ingrédient non trouvéee");
        return null;
    }

    const convertorIngredientAndUnitValue = initiateUnite(quantity, unit.name);

    const unitAfterConvertor = await UnitOfMeasurement.findOne({ name: convertorIngredientAndUnitValue.unitOfMeasurement });

    if (!unitAfterConvertor || !unitAfterConvertor._id) {
        console.log("Un problème est survenu lors de la conversion d'unité");
        return null;
    }

    const createNumber: INumberOfIngredient = new NumberOfIngredients({
        ingredient: ingredient._id,
        unitOfMeasurement: unitAfterConvertor._id,
        quantity: convertorIngredientAndUnitValue.quantity
    });
    const result = await createNumber.save();
    const test = NumberOfIngredients.findById({_id: result._id});
    return test;
}

const findIngredientAndUnit = async(idNumberOfIngredient:string):Promise<void> => {

    const numberOFingredient = await UnitOfMeasurement.findById(idNumberOfIngredient);

    if (!numberOFingredient) {
        throw error("number of ingredient introuvable");
    }

    
    


}


export default {
    newNumberOfIngredients
}
