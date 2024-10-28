import { Request, Response } from "express";
import Dishes from "../models/Dishes";
import DishesServices from "../services/DisheServices";
import NumberOfIngredient from "../models/NumberOfIngredient";

const postDish = async (req: Request, res: Response): Promise<void> => {
    let {dishName, numbersOfIngredients, numberOfPerson} = req.body;
    try {
        const newDish = await DishesServices.createDish(dishName, numbersOfIngredients, numberOfPerson);
        res.status(201).json({message: "Plat créé avec succès", dish: newDish});
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const getSingleDish = async(req:Request, res:Response):Promise<void> => {
    const {idDish} = req.params;

    if (!idDish) {
        res.status(400).json({message: "L'identifiant du plat est requis."});
        return
    }

    try {
        const dish = await DishesServices.getDish(idDish);
        res.status(200).json(dish);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ message: "Plat non trouvé", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }

}

const getAllDishes = async(req:Request, res:Response):Promise<void> => {
    try {
        const allDishes = await Dishes.find();

        if (allDishes.length === 0) {
            res.status(404).json({message: "aucun plat trouvé"})
            return
        }

        res.status(200).json(allDishes);
    } catch (error) {
        
    }
}

const updateDish = async (req: Request, res: Response): Promise<void> => {
    const { disheId, dishName, numbersOfIngredients, numberOfPerson } = req.body;
    try {
        const updatedDish = await DishesServices.modifyDish(disheId, dishName, numbersOfIngredients, numberOfPerson);
        res.status(200).json({ message: "Plat mis à jour avec succès", dish: updatedDish });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const deleteDish = async (req: Request, res: Response): Promise<void> => {
    const { idDishe } = req.params;

    try {
        await DishesServices.removeDish(idDishe);
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

const dishesController = {
    postDish,
    updateDish,
    deleteDish,
    getSingleDish,
    getAllDishes
}

export default dishesController;
