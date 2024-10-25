import { error } from 'console';
import Ingredient, { IIngredient } from '../models/Ingredient';
import {formatIngredientName} from '../utils/formatedIngredientName';

const createIngredient = async (name: string): Promise<void> => {
    const formatedIngredientName = formatIngredientName(name);
    const newIngredient: IIngredient = new Ingredient({ name: formatedIngredientName });
    await newIngredient.save();
}

const findIngredientByName = async (name: string): Promise<IIngredient> => {
    const formattedIngredientName = formatIngredientName(name);
    const ingredient =  await Ingredient.findOne({ name: formattedIngredientName});
    if (!ingredient) {
        throw error("Ingredient introuvable")
    }
    return ingredient
}

const findIngredientById = async (idIngredient:string): Promise<IIngredient> => {
    const ingredient = await Ingredient.findById(idIngredient);
    if (!ingredient) {
        throw error("ingredient introuvable");
    }
    return ingredient
}




export default{createIngredient, findIngredientByName, findIngredientById}
