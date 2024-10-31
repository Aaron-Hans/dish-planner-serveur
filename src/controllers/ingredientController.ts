import Ingredients from '../models/Ingredient';
import { Request, Response } from 'express';
import IngredientServices from '../services/IngredientServices';


const postIngredient = async (req: Request, res: Response): Promise<void> => {
    const { unitName, quantity, productId } = req.body;

    try {
            const createdIngredient = await IngredientServices.createIngredient(productId, unitName, quantity);
            res.status(201).json({ message: "Ingrédients créé avec succès", ingredient: createdIngredient });

    } catch (error) {
        console.error("Erreur lors de la création de l'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const putIngredient = async (req: Request, res: Response): Promise<void> => {
    const { ingredientId, unitName, quantity } = req.body;

    try {
        const updatedIngredient = await IngredientServices.updateIngredient(ingredientId, unitName, quantity);
        res.status(200).json({ message: "Ingrédient modifié", ingredient: updatedIngredient })
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const deleteIngredient = async (req: Request, res: Response): Promise<void> => {
    const { ingredientId } = req.params 
    const ingredient = await Ingredients.findById(ingredientId);

    if (!ingredient) {
        res.status(404).json({ message: "Le nombre d'ingrédients à supprimer est introuvable" })
        return
    }
    try {
        await Ingredients.deleteOne({ _id: ingredient._id })   
        res.status(200).json({ message: "L'ingrédient a été supprimé" })
    } catch (error) {
        console.error('Erreur:', error);
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
