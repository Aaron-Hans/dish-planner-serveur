import Recipe from "../models/Recipe";
import { IIngredient } from "../models/Ingredient";
import ShoppingList, { IShoppingList } from "../models/ShoppingList";
import { formatedProductName } from "../utils/formatedProductName"
import Ingredient from "../models/Product";
import logger from "../config/logger";

/**
 * Creates a new shopping list
 * @param shoppingListName - Optional name for the shopping list. Defaults to "Ma liste de course" if not provided
 * @returns Promise<IShoppingList> - The newly created shopping list
 */
const createShoppingList = async (shoppingListName?: string):Promise<IShoppingList> => {
    if (!shoppingListName) {
        shoppingListName = formatedProductName("Ma liste de course");
    }
    shoppingListName = formatedProductName(shoppingListName);
    
    const newShoppingList = new ShoppingList({
        name: shoppingListName
    })

    await newShoppingList.save();
    logger.info("Shopping list created successfully", {shoppingListName});
    return newShoppingList;
}

/**
 * Updates an existing shopping list with new ingredients or recipe
 * @param shoppingListId - ID of the shopping list to update
 * @param shoppingListName - New name for the shopping list
 * @param ingredientOrDishId - ID of ingredient or recipe to add to the list
 * @returns Promise<IShoppingList> - The updated shopping list
 */
const updateShoppingList = async(shoppingListId: string, shoppingListName: string, ingredientOrDishId: string):Promise<IShoppingList> => {

    if (!shoppingListId || !ingredientOrDishId) {
        logger.error("Missing required information for shopping list update");
        throw new Error("information manquante")
    }

    const shoppingList = await ShoppingList.findById(shoppingListId)

    if (!shoppingList) {
        logger.error("Shopping list not found", {shoppingListId});
        throw new Error("la list n'existe pas");
    }

    const disheOrNumberOfIngredientToAdd = await getIngredientIdByRecipeOrSingleIngredentToAddToTheShoppingList(ingredientOrDishId);

    let updatedList: IShoppingList | null;

    if (!disheOrNumberOfIngredientToAdd.recipeId) {
        updatedList = await ShoppingList.findByIdAndUpdate(
            shoppingList._id,
            {
                name: shoppingListName,
                ingredient: disheOrNumberOfIngredientToAdd.listOfIngredientId,
            },
            {new: true}
        );
    } else {
        logger.info("Adding recipe to shopping list", {recipeId: disheOrNumberOfIngredientToAdd.recipeId});
        updatedList = await ShoppingList.findByIdAndUpdate(
            shoppingList._id,
            {
                name: shoppingListName,
                ingredient: disheOrNumberOfIngredientToAdd.listOfIngredientId,
                recipe: disheOrNumberOfIngredientToAdd.recipeId
            },
            {new: true}
        );
    }

    if (!updatedList) {
        logger.error("Failed to update shopping list", {shoppingListId});
        throw new Error("Erreur lors de la mise à jour de la liste");
    }

    logger.info("Shopping list updated successfully", {shoppingListId});
    return updatedList;
}

/**
 * Finds a shopping list by its ID and populates its ingredients and recipe details
 * @param idList - ID of the shopping list to find
 * @returns Promise<IShoppingList> - The found shopping list with populated data
 */
const findShoppingListById = async(idList: string): Promise<IShoppingList> => {
    if (!idList) {
        logger.error("Missing shopping list ID");
        throw new Error("id de la liste manquant");
    }
    const list = await ShoppingList.findById(idList)
        .populate([
            {
                path: "ingredient",
                populate: [
                    { path: 'product', model: 'products', select: "name"}
                ]
            },
            {
                path: "recipe",
                model: 'recipe',
                select: "name"
            }
        ])
    if (!list) {
        logger.error("Shopping list not found", {idList});
        throw new Error("Liste introuvable");
    }
    if (!list.recipe) {
        await list.populate([
            {
                path: "ingredient",
                populate: [
                    { path: 'product', model: 'products', select: "name"}
                ]
            },
        ]);
    }
    await list.populate([
        {
            path: "ingredient",
            populate: [
                { path: 'product', model: 'products', select: "name"}
            ]
        },
        {
            path: "recipe",
            model: 'recipe',
            select: "name"
        }
    ]);
    
    logger.info("Shopping list found successfully", {idList});
    return list;
}

/**
 * Helper function to get ingredient IDs from either a recipe or single ingredient
 * @param ingredientOrRecipeId - ID of either an ingredient or recipe
 * @returns Promise<{listOfIngredientId: string[], recipeId?: string}> - Array of ingredient IDs and optional recipe ID
 */
const getIngredientIdByRecipeOrSingleIngredentToAddToTheShoppingList = async(ingredientOrRecipeId: string): Promise<{listOfIngredientId: string[], recipeId?: string}> => {
    const isRecipe = await Recipe.exists({_id: ingredientOrRecipeId});

    if (isRecipe) {
        const recipe = await Recipe.findById(ingredientOrRecipeId);
        if (!recipe) {
            logger.error("Recipe not found", {ingredientOrRecipeId});
            throw new Error("Plat introuvable");
        }
        const ingredientIdInRecipe = recipe.ingredient.map((ingredientId: IIngredient) => ingredientId.toString());
        logger.info("Recipe ingredients retrieved successfully", {recipeId: ingredientOrRecipeId});
        return {listOfIngredientId: ingredientIdInRecipe, recipeId: ingredientOrRecipeId};
    } else {
        const ingredient = await Ingredient.findById(ingredientOrRecipeId);
        if (!ingredient) {
            logger.error("Ingredient not found", {ingredientOrRecipeId});
            throw new Error("Ingredient introuvable");
        }
        logger.info("Single ingredient retrieved successfully", {ingredientId: ingredientOrRecipeId});
        return {listOfIngredientId: [ingredientOrRecipeId]};
    }
}

export default {
    createShoppingList,
    updateShoppingList,
    findShoppingListById
}