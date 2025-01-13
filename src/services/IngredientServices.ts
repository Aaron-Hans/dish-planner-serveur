import Product from '../models/Product';
import Ingredient, { IIngredient, UnitType } from '../models/Ingredient';
import { initiateUnite } from '../utils/initiateUnite';
import logger from '../config/logger';

/**
 * Creates a new ingredient with the given product ID, unit and quantity
 * @param productId - The ID of the product to associate with the ingredient
 * @param unitName - The unit of measurement for the ingredient
 * @param quantity - The quantity of the ingredient
 * @returns Promise<IIngredient> - The newly created ingredient
 */
const createIngredient = async (productId: string, unitName: UnitType, quantity: number): Promise<IIngredient> => {
    const product = await Product.findById(productId);

    if (!product) {
        logger.error("Product not found when creating ingredient", {productId});
        throw new Error("Ingrédient non trouvé");
    }

    const convertorIngredientAndUnitValue = initiateUnite(quantity, unitName);

    const newIngredient: IIngredient = new Ingredient({
        product: product._id,
        unit: convertorIngredientAndUnitValue.unitOfMeasurement,
        quantity: convertorIngredientAndUnitValue.quantity
    });
    const newIngredientToSave = await newIngredient.save();
    const ingredient = await Ingredient.findById(newIngredientToSave._id);
    if (!ingredient) {
        logger.error("Error saving new ingredient");
        throw new Error("Un problème est survenu lors de la sauvegarde de l'ingrédients");
    }
    logger.info("Ingredient created successfully", {ingredientId: ingredient._id});
    return ingredient;
}

/**
 * Updates an existing ingredient with new unit and quantity values
 * @param ingredientId - The ID of the ingredient to update
 * @param unitName - The new unit of measurement
 * @param quantity - The new quantity
 * @returns Promise<IIngredient> - The updated ingredient
 */
const updateIngredient = async(ingredientId:string, unitName:UnitType, quantity:number ):Promise<IIngredient> => {

    const ingredient = await Ingredient.findById(ingredientId)
    .populate({
        path: 'product',
    })

    if (!ingredient) {
        logger.error("Ingredient not found for update", {ingredientId});
        throw new Error("Nombre d'ingrédients introuvable");
    }

    console.log(ingredient.product)

    const convertorIngredientAndUnitValue = initiateUnite(quantity, unitName);

    await Ingredient.updateOne({_id: ingredient._id}, {$set: {product: ingredient.product, unit: convertorIngredientAndUnitValue.unitOfMeasurement, quantity: convertorIngredientAndUnitValue.quantity}})

    const updatedIngredient = await Ingredient.findById(ingredientId);
    if (!updatedIngredient) {
        logger.error("Error updating ingredient", {ingredientId});
        throw new Error("Un problème est survenu lors de la mise à jour du nombre d'ingrédients");
    }
    logger.info("Ingredient updated successfully", {ingredientId});
    return updatedIngredient;
}

/**
 * Deletes an ingredient from the database
 * @param ingredientId - The ID of the ingredient to delete
 * @returns Promise<void>
 */
const deleteIngredient = async(ingredientId: string):Promise<void> => {

    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient) {
        logger.error("Ingredient not found for deletion", {ingredientId});
        throw new Error("cette ingredient n'existe pas");
    }

    await Ingredient.deleteOne({ _id: ingredient._id })
    logger.info("Ingredient deleted successfully", {ingredientId});
}


export default {
    createIngredient,
    updateIngredient,
    deleteIngredient
}
