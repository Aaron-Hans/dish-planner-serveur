import Recipe from "../models/Recipe";
import { IIngredient } from "../models/Ingredient";
import ShoppingList, { IShoppingList } from "../models/ShoppingList";
import { formatedProductName } from "../utils/formatedProductName"
import Ingredient from "../models/Product";

const createShoppingList = async (shoppingListName?: string):Promise<IShoppingList> => {
    if (!shoppingListName) {
        shoppingListName = formatedProductName("Ma liste de course");
    }
    shoppingListName = formatedProductName(shoppingListName);
    
    const newShoppingList = new ShoppingList({
        name: shoppingListName
    })

    await newShoppingList.save();
    return newShoppingList;
}

const updateShoppingList = async(shoppingListId: string, shoppingListName: string, ingredientOrDishId: string):Promise<IShoppingList> => {

    if (!shoppingListId || !ingredientOrDishId) {
        throw new Error("information manquante")
    }

    const shoppingList = await ShoppingList.findById(shoppingListId)

    if (!shoppingList) {
        throw new Error("la list n'existe pas");
    }

    const disheOrNumberOfIngredientToAdd = await getIngredientIdByRecipeOrSingleIngredentToAddToTheShoppingList(ingredientOrDishId);

    console.log(disheOrNumberOfIngredientToAdd.recipeId);

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
        console.log("recipe")
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
        throw new Error("Erreur lors de la mise à jour de la liste");
    }

    return updatedList;
}

const findShoppingListById = async(idList: string): Promise<IShoppingList> => {
    if (!idList) {
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
    
    return list;
}

const getIngredientIdByRecipeOrSingleIngredentToAddToTheShoppingList = async(ingredientOrRecipeId: string): Promise<{listOfIngredientId: string[], recipeId?: string}> => {
    const isRecipe = await Recipe.exists({_id: ingredientOrRecipeId});

    if (isRecipe) {
        const recipe = await Recipe.findById(ingredientOrRecipeId);
        if (!recipe) {
            throw new Error("Plat introuvable");
        }
        const ingredientIdInRecipe = recipe.ingredient.map((ingredientId: IIngredient) => ingredientId.toString());
        return {listOfIngredientId: ingredientIdInRecipe, recipeId: ingredientOrRecipeId};
    } else {
        const ingredient = await Ingredient.findById(ingredientOrRecipeId);
        if (!ingredient) {
            throw new Error("Ingredient introuvable");
        }
        return {listOfIngredientId: [ingredientOrRecipeId]};
    }
}





export default {
    createShoppingList,
    updateShoppingList,
    findShoppingListById
}