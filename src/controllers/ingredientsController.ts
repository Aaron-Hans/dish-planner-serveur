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

const findAllIngredients = async (req: Request, res: Response): Promise<void> => {
    try {
        const allIngredients = await Ingredient.find();
        if (allIngredients.length === 0) {
            res.status(404).json({message: "Aucun ingrédient trouvé"});
        } else {
            res.status(200).json({message: "liste des ingrédients", ingredients: allIngredients});
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

const findIngredientByName = async (req: Request, res: Response): Promise<void> => {
    const {name} = req.params;

    try {
        const ingredient = await IngredientServices.findIngredientByName(name);
        if (!ingredient) {
            res.status(404).json({message: "Ingredient non trouvé"});           
        } else {
            res.status(200).json({message: "Ingrédient trouvé", ingredient: ingredient});
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

const findIngredientById = async (req: Request, res: Response): Promise<void> => {
    const { idIngredient } = req.params;
    console.log(idIngredient);

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

const updateIngredient = async (req: Request, res: Response): Promise<void> => {
    let {currentName, updatedName} = req.body;

    currentName = formatIngredientName(currentName);
    updatedName = formatIngredientName(updatedName);

    try {
        const ingredient = await Ingredient.findOne({ name: currentName });

        if (!ingredient) {
            res.status(404).json({ message: "Ingrédient non trouvé." });
            return;
        } 
        const result = await Ingredient.updateOne({ _id: ingredient._id }, { $set: {name: updatedName} });
        res.status(200).json({ message: "Ingrédient mis à jour avec succès", result });
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
    let {ingredientToDelete} = req.params;
    
    ingredientToDelete = formatIngredientName(ingredientToDelete);
    
    try {
        const result = await Ingredient.deleteOne({ name: ingredientToDelete });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `L'ingrédient ${ingredientToDelete} n'a pas été trouvé.` });
        } else {
            res.status(200).json({ message: `L'ingrédient ${ingredientToDelete} a été supprimé.` });
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
    updateIngredient,
    findAllIngredients,
    findIngredientByName,
    findIngredientById,
    deleteIngredientByName
};

export default ingredientsController;
