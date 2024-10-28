import Ingredient from '../models/Ingredient';
import IngredientServices from '../services/IngredientServices';
import { Request, Response } from 'express';
import {formatIngredientName} from '../utils/formatedIngredientName';

const postIngredient = async (req: Request, res: Response): Promise<void> => {
    const { ingredientName } = req.body;

    if (!ingredientName) {
        res.status(400).json({ message: "Le nom de l'ingrédient est requis." });
        return;
    }

    try {    
        const newIngredient = await IngredientServices.createIngredient(ingredientName)
        res.status(201).json({ message: "Ingrédient créé avec succès", ingredient: newIngredient });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            if (error.name === 'MongoError' && 'code' in error && error.code === 11000) {
                res.status(409).json({ message: "Erreur : cet ingrédient existe déjà." });
            } else {
                res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
            }
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const getAllIngredients = async (req: Request, res: Response): Promise<void> => {
    try {
        const allIngredients = await Ingredient.find();
        if (allIngredients.length === 0) {
            res.status(404).json({message: "Aucun ingrédient trouvé"});
        } else {
            res.status(200).json(allIngredients);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const getIngredientByName = async (req: Request, res: Response): Promise<void> => {
    const {ingredientName} = req.params;

    try {
        const ingredient = await IngredientServices.findIngredientByName(ingredientName);
        if (!ingredient) {
            res.status(404).json({message: "Ingredient non trouvé"});           
        } else {
            res.status(200).json(ingredient);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const getIngredientById = async (req: Request, res: Response): Promise<void> => {
    const { idIngredient } = req.params;

    if (!idIngredient) {
        res.status(400).json({ message: "L'identifiant de l'ingrédient est requis." });
        return;
    }

    try {
        const ingredient = await Ingredient.findById(idIngredient);

        if (!ingredient) {
            res.status(404).json({ message: "Ingrédient non trouvé" });
        } else {
            res.status(200).json(ingredient);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }    
};

const putIngredient = async (req: Request, res: Response): Promise<void> => {
    let {idIngredient, newIngredientName} = req.body;

    newIngredientName = formatIngredientName(newIngredientName);

    try {
        const ingredient = await Ingredient.findById(idIngredient);

        if (!ingredient) {
            res.status(404).json({ message: "Ingrédient non trouvé." });
            return;
        } 
        await Ingredient.updateOne({ _id: ingredient }, { $set: {name: newIngredientName} });
        res.status(200).json({ message: "Ingrédient mis à jour avec succès"});
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const deleteIngredientByName = async (req: Request, res: Response): Promise<void> => {
    let {idIngredient} = req.params;
        
    try {
        const result = await Ingredient.deleteOne({ _id: idIngredient });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `L'ingrédient ${idIngredient} n'a pas été trouvé.` });
        } else {
            res.status(200).json({ message: `L'ingrédient ${idIngredient} a été supprimé.` });
        }
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const ingredientsController = {
    postIngredient,
    putIngredient,
    getAllIngredients,
    getIngredientByName,
    getIngredientById,
    deleteIngredientByName
};

export default ingredientsController;
