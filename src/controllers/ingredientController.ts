import Ingredients from '../models/Ingredient';
import { Request, Response } from 'express';
import IngredientServices from '../services/IngredientServices';
import logger from '../config/logger';

/**
 * Creates a new ingredient
 * @param req - Express Request object containing unitName, quantity and productId in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 201 with created ingredient or 500 on error
 */
const postIngredient = async (req: Request, res: Response): Promise<void> => {
    const { unitName, quantity, productId } = req.body;
    logger.debug('Attempting to create ingredient', { unitName, quantity, productId });

    try {
        const createdIngredient = await IngredientServices.createIngredient(productId, unitName, quantity);
        logger.info('Ingredient created successfully', { ingredientId: createdIngredient._id });
        res.status(201).json({ message: "Ingrédients créé avec succès", ingredient: createdIngredient });

    } catch (error) {
        logger.error('Error creating ingredient:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * Updates an existing ingredient
 * @param req - Express Request object containing ingredientId, unitName and quantity in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with updated ingredient or 500 on error
 */
const putIngredient = async (req: Request, res: Response): Promise<void> => {
    const { ingredientId, unitName, quantity } = req.body;
    logger.debug('Attempting to update ingredient', { ingredientId, unitName, quantity });

    try {
        const updatedIngredient = await IngredientServices.updateIngredient(ingredientId, unitName, quantity);
        logger.info('Ingredient updated successfully', { ingredientId });
        res.status(200).json({ message: "Ingrédient modifié", ingredient: updatedIngredient })
    } catch (error) {
        logger.error('Error updating ingredient:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

/**
 * Deletes an ingredient by ID
 * @param req - Express Request object containing ingredientId in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 on successful deletion, 404 if not found, or 500 on error
 */
const deleteIngredient = async (req: Request, res: Response): Promise<void> => {
    const { ingredientId } = req.params;
    logger.debug('Attempting to delete ingredient', { ingredientId });

    const ingredient = await Ingredients.findById(ingredientId);

    if (!ingredient) {
        logger.warn('Ingredient not found for deletion', { ingredientId });
        res.status(404).json({ message: "Le nombre d'ingrédients à supprimer est introuvable" })
        return
    }
    try {
        await Ingredients.deleteOne({ _id: ingredient._id })   
        logger.info('Ingredient deleted successfully', { ingredientId });
        res.status(200).json({ message: "L'ingrédient a été supprimé" })
    } catch (error) {
        logger.error('Error deleting ingredient:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}


const ingredientController = {
    postIngredient,
    putIngredient,
    deleteIngredient
};

export default ingredientController;
