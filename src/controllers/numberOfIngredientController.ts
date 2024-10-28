import NumberOfIngredients from '../models/NumberOfIngredient';
import { Request, Response } from 'express';
import NumberOfIngredientServices from '../services/NumberOfIngredientServices';


const postNumberOfIngredient = async (req: Request, res: Response): Promise<void> => {
    const { idUnit, quantity, idIngredient } = req.body;

    try {
            await NumberOfIngredientServices.createNumberOfIngredients(idIngredient, idUnit, quantity);
            res.status(201).json({ message: "Nombre d'ingrédients créé avec succès" });

    } catch (error) {
        console.error("Erreur lors de la création du nombre d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const putNumberOfIngredient = async (req: Request, res: Response): Promise<void> => {
    const { idIngredientNumber, idIngredient, idUnit, quantity } = req.body;

    try {
        await NumberOfIngredientServices.updateNumberOfIngredient(idIngredientNumber, idIngredient, idUnit, quantity);
        res.status(200).json({ message: "Ingrédient modifié" })
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const deleteNumberOfIngredient = async (req: Request, res: Response): Promise<void> => {
    const { idNumberOfIngredient } = req.params 
    const numberOfIngredientToDelete = await NumberOfIngredients.findById(idNumberOfIngredient);

    if (!numberOfIngredientToDelete) {
        res.status(404).json({ message: "Le nombre d'ingrédients à supprimer est introuvable" })
        return
    }
    try {
        await NumberOfIngredients.deleteOne({ _id: numberOfIngredientToDelete._id })   
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


const numberOfIngredientController = {
    postNumberOfIngredient,
    putNumberOfIngredient,
    deleteNumberOfIngredient
};

export default numberOfIngredientController;
