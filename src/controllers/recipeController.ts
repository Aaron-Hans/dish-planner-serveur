import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import RecipeServices from "../services/RecipeServices";
import logger from '../config/logger';

/**
 * Creates a new recipe
 * @param req - Express Request object containing recipeName and listOfIngredient in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 201 with created recipe or error status codes
 */
const postRecipe = async (req: Request, res: Response): Promise<void> => {
    let {recipeName, listOfIngredient} = req.body;
    logger.debug('Attempting to create recipe', { recipeName });
    try {
        const newRecipe = await RecipeServices.createRecipe(recipeName, listOfIngredient);
        logger.info('Recipe created successfully', { recipeId: newRecipe._id });
        res.status(201).json({message: "Recette créé avec succès", recipe: newRecipe});
    } catch (error) {
        logger.error('Error creating recipe:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

/**
 * Retrieves a specific recipe by ID
 * @param req - Express Request object containing recipeId in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with recipe or error status codes
 */
const getRecipe = async(req:Request, res:Response):Promise<void> => {
    const {recipeId} = req.params;
    logger.debug('Attempting to retrieve recipe', { recipeId });

    if (!recipeId) {
        logger.warn('Recipe ID not provided');
        res.status(400).json({message: "L'identifiant du plat est requis."});
        return
    }

    try {
        const recipe = await RecipeServices.findRecipe(recipeId);
        logger.info('Recipe retrieved successfully', { recipeId });
        res.status(200).json(recipe);
    } catch (error) {
        logger.error('Error retrieving recipe:', error);
        if (error instanceof Error) {
            res.status(404).json({ message: "Plat non trouvé", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

/**
 * Retrieves all recipes from the database
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with recipes array or 404 if none found
 */
const getAllRecipes = async(req:Request, res:Response):Promise<void> => {
    logger.debug('Attempting to retrieve all recipes');
    try {
        const allDishes = await Recipe.find();

        if (allDishes.length === 0) {
            logger.info('No recipes found');
            res.status(404).json({message: "aucune recette trouvé"})
            return
        }

        logger.info('Recipes retrieved successfully', { count: allDishes.length });
        res.status(200).json(allDishes);
    } catch (error) {
        logger.error('Error retrieving all recipes:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

/**
 * Updates an existing recipe
 * @param req - Express Request object containing recipeId, recipeName and listOfIngredient in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with updated recipe or error status codes
 */
const updateRecipe = async (req: Request, res: Response): Promise<void> => {
    const { recipeId, recipeName, listOfIngredient } = req.body;
    logger.debug('Attempting to update recipe', { recipeId, recipeName });
    try {
        const updatedRecipe = await RecipeServices.modifyRecipe(recipeId, recipeName, listOfIngredient);
        logger.info('Recipe updated successfully', { recipeId });
        res.status(200).json({ message: "Recette mis à jour avec succès", dish: updatedRecipe });
    } catch (error) {
        logger.error('Error updating recipe:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

/**
 * Deletes a recipe by ID
 * @param req - Express Request object containing recipeId in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 on successful deletion or error status codes
 */
const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
    const { recipeId } = req.params;
    logger.debug('Attempting to delete recipe', { recipeId });

    try {
        await RecipeServices.removeRecipe(recipeId);
        logger.info('Recipe deleted successfully', { recipeId });
        res.status(200).json({ message: "Plat supprimé avec succès" });
    } catch (error) {
        logger.error('Error deleting recipe:', error);
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
