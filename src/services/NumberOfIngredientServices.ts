import Ingredient from '../models/Ingredient';
import NumberOfIngredients, { INumberOfIngredient } from '../models/NumberOfIngredient';
import UnitOfMeasurement from '../models/UnitOfMeasurement';
import { initiateUnite } from '../utils/initiateUnite';
import { measurmentConvertor } from '../utils/unitConversion';

const createNumberOfIngredients = async (ingredientId: string, unitId: string, quantity: number): Promise<INumberOfIngredient> => {
    const ingredient = await Ingredient.findById(ingredientId);
    const unit = await UnitOfMeasurement.findById(unitId);

    if (!unit) {
        throw new Error("Unité non trouvée");
    }
    if (!ingredient) {
        throw new Error("Ingrédient non trouvé");
    }

    const convertorIngredientAndUnitValue = initiateUnite(quantity, unit.name);

    const unitAfterConvertor = await UnitOfMeasurement.findOne({ name: convertorIngredientAndUnitValue.unitOfMeasurement });

    if (!unitAfterConvertor) {
        throw new Error("Un problème est survenu lors de la conversion d'unité");
    }

    const newNumber: INumberOfIngredient = new NumberOfIngredients({
        ingredient: ingredient._id,
        unitOfMeasurement: unitAfterConvertor._id,
        quantity: convertorIngredientAndUnitValue.quantity
    });
    const newNumberToSave = await newNumber.save();
    const number = await NumberOfIngredients.findById(newNumberToSave._id);
    if (!number) {
        throw new Error("Un problème est survenu lors de la sauvegarde du nombre d'ingrédients");
    }
    return number;
}

const updateNumberOfIngredient = async(idIngredientNumber:string, idIngredient:string, idUnit:string, quantity:number ):Promise<INumberOfIngredient> => {

    const ingredientNumber = await NumberOfIngredients.findById(idIngredientNumber)
    .populate({
        path: 'unitOfMeasurement',
    })
    console.log(ingredientNumber)
    const ingredient = await Ingredient.findById(idIngredient);
    const unit = await UnitOfMeasurement.findById(idUnit);


    if (!ingredientNumber) {
        throw new Error("Nombre d'ingrédients introuvable");
    }
    if (!ingredient) {
        throw new Error("Ingrédient introuvable");
    }
    if (!unit) {
        throw new Error("Unité de mesure introuvable");
    }   

    const convertorIngredientAndUnitValue = measurmentConvertor(quantity, ingredientNumber.unitOfMeasurement.name, unit.name);

    const unitAfterConvertor = await UnitOfMeasurement.findOne({ name: convertorIngredientAndUnitValue.unit });

    if (!unitAfterConvertor) {
        throw new Error("Un problème est survenu lors de la conversion d'unité");
    }

    await NumberOfIngredients.updateOne({_id: ingredientNumber._id}, {$set: {ingredient: ingredient._id, unitOfMeasurement: unitAfterConvertor._id, quantity: convertorIngredientAndUnitValue.quantity}})

    const updatedNumberOfIngredient = await NumberOfIngredients.findById(idIngredientNumber);
    if (!updatedNumberOfIngredient) {
        throw new Error("Un problème est survenu lors de la mise à jour du nombre d'ingrédients");
    }
    return updatedNumberOfIngredient;

}


export default {
    createNumberOfIngredients,
    updateNumberOfIngredient
}
