import { Request, Response } from "express";
import ShoppingListServices from "../services/ShoppingListServices";
import ShoppingList from "../models/ShoppingList";
import logger from '../config/logger';

/**
 * Creates a new shopping list
 * @param req - Express Request object containing shoppingListName in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 201 with created list or error status codes
 */
const postShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {shoppingListName} = req.body;
    logger.debug('Attempting to create shopping list', { shoppingListName });

    if (!shoppingListName) {
        logger.warn('Shopping list name not provided');
        res.status(404).json({message: "nom manquant"})
    }
    try {
        const newShoppinglist = await ShoppingListServices.createShoppingList(shoppingListName);
        logger.info('Shopping list created successfully', { listId: newShoppinglist._id });
        res.status(201).json({message:'liste créer', newShoppinglist})
    } catch (error) {
        logger.error('Error creating shopping list:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

/**
 * Updates an existing shopping list
 * @param req - Express Request object containing idShoppingList, shoppingListName and idNbrIngredientOrDish in body
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with updated list or error status codes
 */
const putShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList, shoppingListName, idNbrIngredientOrDish} = req.body; 
    logger.debug('Attempting to update shopping list', { idShoppingList, shoppingListName });

    try {
        const updatedList = await ShoppingListServices.updateShoppingList(idShoppingList, shoppingListName, idNbrIngredientOrDish);
        logger.info('Shopping list updated successfully', { listId: idShoppingList });
        res.status(200).json({message: "liste modifiée", updatedList})
    } catch (error) {
        logger.error('Error updating shopping list:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

/**
 * Deletes a shopping list by ID
 * @param req - Express Request object containing idShoppingList in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 on successful deletion or error status codes
 */
const deleteShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList} = req.params;
    logger.debug('Attempting to delete shopping list', { idShoppingList });

    try {
        const deleteShoppingList = await ShoppingList.findByIdAndDelete(idShoppingList);
        logger.info('Shopping list deleted successfully', { listId: idShoppingList });
        res.status(200).json({message: "liste de course supprimée", deleteShoppingList})
    } catch (error) {
        logger.error('Error deleting shopping list:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

/**
 * Retrieves a specific shopping list by ID
 * @param req - Express Request object containing idShoppingList in params
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with shopping list or error status codes
 */
const getShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList} = req.params;
    logger.debug('Attempting to retrieve shopping list', { idShoppingList });

    try {
        const list = await ShoppingListServices.findShoppingListById(idShoppingList);
        logger.info('Shopping list retrieved successfully', { listId: idShoppingList });
        res.status(200).json({message: "liste récupérée", list})
    } catch (error) {
        logger.error('Error retrieving shopping list:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

/**
 * Retrieves all shopping lists from the database
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void> - Returns 200 with lists array or 404 if none found
 */
const getAllShoppingList = async (req: Request, res: Response): Promise<void> => {
    logger.debug('Attempting to retrieve all shopping lists');

    try {
        const allList = await ShoppingList.find();
        if (allList.length === 0) {
            logger.info('No shopping lists found');
            res.status(404).json({message: "Aucune liste trouvé"});
        } else {
            logger.info('Shopping lists retrieved successfully', { count: allList.length });
            res.status(200).json(allList);
        }
    } catch (error) {
        logger.error('Error retrieving shopping lists:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const shoppingListController = {
    postShoppingList,
    putShoppingList,
    deleteShoppingList,
    getShoppingList,
    getAllShoppingList
}

export default shoppingListController;