import Recipe, { IRecipe } from "../models/Recipe"
import Ingredient, { IIngredient } from "../models/Ingredient";
import { formatedProductName } from "../utils/formatedProductName";
import IngredientServices from "./IngredientServices";

const createRecipe = async (recipeName: string, listOfIngredient: IIngredient[]): Promise<IRecipe> => {
    recipeName = formatedProductName(recipeName);
    const createPromises = listOfIngredient.map(async (ingredient: IIngredient) => {
        if (!ingredient.product) {
            throw new Error("Le produit n'est pas renseigné");
        }

        if (!ingredient.unit) {
            throw new Error("L'unité de mesure n'est pas renseignée");
        }

        if (!ingredient.quantity) {
            throw new Error("La quantité n'est pas renseignée");
        }

        const productId = ingredient.product.toString();
        const unitName = ingredient.unit;
        const quantity = Number(ingredient.quantity);
        const newIngredient = await IngredientServices.createIngredient(productId, unitName, quantity);

        if (!newIngredient._id) {
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
    return newRecipe;
}

const findRecipe = async (recipeId: string) : Promise<IRecipe> => {

    const recipe = await Recipe.findById(recipeId)
    .populate({
        path: "ingredient",
        populate: [
            {path: 'product', model: 'products', select: "name"},
        ]
    });

    if (!recipe) {
        throw new Error('plat non trouvée');
    }

    return recipe
}

const modifyRecipe = async (recipeId: string, recipeName: string, listOfIngredient: IIngredient[]): Promise<IRecipe> => {
    if (!recipeId) {
        throw new Error("ID du plat non renseigné");
    }

    recipeName = formatedProductName(recipeName);

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
        throw new Error("Plat non trouvé");
    }
    const updatePromises = recipe.ingredient.map(async (listOfIngredientIdInRecipe: IIngredient) => {
        if (!listOfIngredientIdInRecipe) {
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
                throw new Error("Objet numberOfIngredient introuvable");
            }        }
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


    console.log(newIngredientIdArray)
    const updateRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { 
            name: recipeName, 
            ingredient: newIngredientIdArray,
        }, 
        { new: true }
    );
    if (!updateRecipe) {
        throw new Error("Erreur lors de la mise à jour de la recette");
    }
    return updateRecipe;
}

const removeRecipe = async (recipeId: string): Promise<void> => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new Error("Recette non trouvé");
    }

    const deletePromises = recipe.ingredient.map(async (listOfIngredientIdInRecipe) => {
        if (!listOfIngredientIdInRecipe) {
            throw new Error('ID Number ingredient introuvable');
        }

        const result = await Ingredient.deleteOne({ _id: listOfIngredientIdInRecipe });

        if (result.deletedCount === 0) {
            throw new Error("Erreur lors de la suppression de l'ingrédient");
        }
    });
    await Promise.all(deletePromises);
    
    const result = await Recipe.deleteOne({ _id: recipe._id });
    if (result.deletedCount === 0) {
        throw new Error("Erreur lors de la suppression du plat");
    }
}
export default { 
    createRecipe,
    findRecipe,
    modifyRecipe,
    removeRecipe
};
