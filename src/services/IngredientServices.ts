import Product from '../models/Product';
import Ingredient, { IIngredient, UnitType } from '../models/Ingredient';
import { initiateUnite } from '../utils/initiateUnite';

const createIngredient = async (productId: string, unitName: UnitType, quantity: number): Promise<IIngredient> => {
    const product = await Product.findById(productId);

    if (!product) {
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
        throw new Error("Un problème est survenu lors de la sauvegarde de l'ingrédients");
    }
    return ingredient;
}

const updateIngredient = async(ingredientId:string, unitName:UnitType, quantity:number ):Promise<IIngredient> => {

    const ingredient = await Ingredient.findById(ingredientId)
    .populate({
        path: 'product',
    })

    if (!ingredient) {
        throw new Error("Nombre d'ingrédients introuvable");
    }

    console.log(ingredient.product)

    const convertorIngredientAndUnitValue = initiateUnite(quantity, unitName);

    await Ingredient.updateOne({_id: ingredient._id}, {$set: {product: ingredient.product, unit: convertorIngredientAndUnitValue.unitOfMeasurement, quantity: convertorIngredientAndUnitValue.quantity}})

    const updatedIngredient = await Ingredient.findById(ingredientId);
    if (!updatedIngredient) {
        throw new Error("Un problème est survenu lors de la mise à jour du nombre d'ingrédients");
    }
    return updatedIngredient;

}

const deleteIngredient = async(ingredientId: string):Promise<void> => {

    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient) {
        throw new Error("cette ingredient n'existe pas");
    }

    await Ingredient.deleteOne({ _id: ingredient._id }) 
}


export default {
    createIngredient,
    updateIngredient,
    deleteIngredient
}
