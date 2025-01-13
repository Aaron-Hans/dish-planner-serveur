import Recipe, { IRecipe } from "../models/Recipe"
import Ingredient, { IIngredient } from "../models/Ingredient";
import { formatedProductName } from "../utils/formatedProductName";
import IngredientServices from "./IngredientServices";
import logger from "../config/logger";

/**
 * Creates a new recipe with ingredients
 * @param recipeName - The name of the recipe to create
 * @param listOfIngredient - Array of ingredients to add to the recipe
 * @returns Promise<IRecipe> - The newly created recipe
 */
const createRecipe = async (recipeName: string, listOfIngredient: IIngredient[]): Promise<IRecipe> => {
    try {
        recipeName = formatedProductName(recipeName);
        const createPromises = listOfIngredient.map(async (ingredient: IIngredient) => {
            if (!ingredient.product) {
                logger.error("Missing product in ingredient");
                throw new Error("Le produit n'est pas renseigné");
            }

            if (!ingredient.unit) {
                logger.error("Missing unit in ingredient");
                throw new Error("L'unité de mesure n'est pas renseignée");
            }

            if (!ingredient.quantity) {
                logger.error("Missing quantity in ingredient");
                throw new Error("La quantité n'est pas renseignée");
            }

            const productId = ingredient.product.toString();
            const unitName = ingredient.unit;
            const quantity = Number(ingredient.quantity);
            const newIngredient = await IngredientServices.createIngredient(productId, unitName, quantity);

            if (!newIngredient._id) {
                logger.error("Error creating ingredient");
                throw new Error("Erreur lors de la création du nombre d'ingrédients");
            }
            return newIngredient._id;
        })
        const listOfIngredientId = await Promise.all(createPromises);

        const newRecipe = new Recipe({
            name: recipeName,
            ingredient: listOfIngredientId,
        })
        await newRecipe.save();
        logger.info("Recipe created successfully", {recipeName});
        return newRecipe;
    } catch (error) {
        logger.error("Error in createRecipe", {error});
        throw error;
    }
}

/**
 * Finds a recipe by its ID
 * @param recipeId - The ID of the recipe to find
 * @returns Promise<IRecipe> - The found recipe with populated ingredients
 */
const findRecipe = async (recipeId: string) : Promise<IRecipe> => {
    try {
        const recipe = await Recipe.findById(recipeId)
        .populate({
            path: "ingredient",
            populate: [
                {path: 'product', model: 'products', select: "name"},
            ]
        });

        if (!recipe) {
            logger.error("Recipe not found", {recipeId});
            throw new Error('plat non trouvée');
        }

        logger.info("Recipe found successfully", {recipeId});
        return recipe;
    } catch (error) {
        logger.error("Error in findRecipe", {error});
        throw error;
    }
}

/**
 * Modifies an existing recipe
 * @param recipeId - The ID of the recipe to modify
 * @param recipeName - The new name for the recipe
 * @param listOfIngredient - Array of updated ingredients
 * @returns Promise<IRecipe> - The updated recipe
 */
const modifyRecipe = async (recipeId: string, recipeName: string, listOfIngredient: IIngredient[]): Promise<IRecipe> => {
    try {
        if (!recipeId) {
            logger.error("Recipe ID not provided");
            throw new Error("ID du plat non renseigné");
        }

        recipeName = formatedProductName(recipeName);

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            logger.error("Recipe not found", {recipeId});
            throw new Error("Plat non trouvé");
        }
        const updatePromises = recipe.ingredient.map(async (listOfIngredientIdInRecipe: IIngredient) => {
            if (!listOfIngredientIdInRecipe) {
                logger.error("Ingredient ID missing");
                throw new Error("ID de l'ingrédients est non renseigné");
            }
            const matchingIngredientId = listOfIngredient.find(
                (ingredientIdToUpdate: IIngredient) => {
                    return ingredientIdToUpdate._id?.toString() === listOfIngredientIdInRecipe.toString()
                }
            );

            if (matchingIngredientId) {
                const updatedIngredient = await Ingredient.findOneAndUpdate(
                    { _id: matchingIngredientId },
                    {
                        ingredient: matchingIngredientId.product,
                        unit: matchingIngredientId.unit,
                        quantity: matchingIngredientId.quantity
                    },
                    { new: true }
                );
        
                if (!updatedIngredient) {
                    logger.error("Ingredient not found for update");
                    throw new Error("Objet numberOfIngredient introuvable");
                }
            }
        });
        await Promise.all(updatePromises);

        const newIngredientIdArray: string[] = recipe.ingredient.map((ingredientId: IIngredient) => ingredientId.toString());
        
        const newIngredientPromises = listOfIngredient.map(async (ingredient: IIngredient) => {
            if (!ingredient._id) {
                const newIngredient = await IngredientServices.createIngredient(ingredient.product.toString(), ingredient.unit, ingredient.quantity as number);
                return newIngredient._id as string;
            }
            return null;
        });
        
        const newIngredientIds = await Promise.all(newIngredientPromises);
        newIngredientIds.forEach(id => {
            if (id) {
                newIngredientIdArray.push(id);
            }
        });

        const updateRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { 
                name: recipeName, 
                ingredient: newIngredientIdArray,
            }, 
            { new: true }
        );
        if (!updateRecipe) {
            logger.error("Error updating recipe", {recipeId});
            throw new Error("Erreur lors de la mise à jour de la recette");
        }
        logger.info("Recipe updated successfully", {recipeId});
        return updateRecipe;
    } catch (error) {
        logger.error("Error in modifyRecipe", {error});
        throw error;
    }
}

/**
 * Removes a recipe and its ingredients
 * @param recipeId - The ID of the recipe to remove
 * @returns Promise<void>
 */
const removeRecipe = async (recipeId: string): Promise<void> => {
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            logger.error("Recipe not found for deletion", {recipeId});
            throw new Error("Recette non trouvé");
        }

        const deletePromises = recipe.ingredient.map(async (listOfIngredientIdInRecipe) => {
            if (!listOfIngredientIdInRecipe) {
                logger.error("Ingredient ID missing for deletion");
                throw new Error('ID Number ingredient introuvable');
            }

            const result = await Ingredient.deleteOne({ _id: listOfIngredientIdInRecipe });

            if (result.deletedCount === 0) {
                logger.error("Error deleting ingredient");
                throw new Error("Erreur lors de la suppression de l'ingrédient");
            }
        });
        await Promise.all(deletePromises);
        
        const result = await Recipe.deleteOne({ _id: recipe._id });
        if (result.deletedCount === 0) {
            logger.error("Error deleting recipe", {recipeId});
            throw new Error("Erreur lors de la suppression du plat");
        }
        logger.info("Recipe deleted successfully", {recipeId});
    } catch (error) {
        logger.error("Error in removeRecipe", {error});
        throw error;
    }
}

export default { 
    createRecipe,
    findRecipe,
    modifyRecipe,
    removeRecipe
};
