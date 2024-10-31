import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import RecipeServices from "../services/RecipeServices";

const postRecipe = async (req: Request, res: Response): Promise<void> => {
    let {recipeName, listOfIngredient} = req.body;
    try {
        const newRecipe = await RecipeServices.createRecipe(recipeName, listOfIngredient);
        res.status(201).json({message: "Recette créé avec succès", recipe: newRecipe});
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const getRecipe = async(req:Request, res:Response):Promise<void> => {
    const {recipeId} = req.params;

    if (!recipeId) {
        res.status(400).json({message: "L'identifiant du plat est requis."});
        return
    }

    try {
        const recipe = await RecipeServices.findRecipe(recipeId);
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ message: "Plat non trouvé", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }

}

const getAllRecipes = async(req:Request, res:Response):Promise<void> => {
    try {
        const allDishes = await Recipe.find();

        if (allDishes.length === 0) {
            res.status(404).json({message: "aucune recette trouvé"})
            return
        }

        res.status(200).json(allDishes);
    } catch (error) {
        
    }
}

const updateRecipe = async (req: Request, res: Response): Promise<void> => {
    const { recipeId, recipeName, listOfIngredient } = req.body;
    try {
        const updatedRecipe = await RecipeServices.modifyRecipe(recipeId, recipeName, listOfIngredient);
        res.status(200).json({ message: "Recette mis à jour avec succès", dish: updatedRecipe });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
    const { recipeId } = req.params;

    try {
        await RecipeServices.removeRecipe(recipeId);
        res.status(200).json({ message: "Plat supprimé avec succès" });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const recipeController = {
    postRecipe,
    getRecipe,
    getAllRecipes,
    updateRecipe,
    deleteRecipe
}

export default recipeController;
