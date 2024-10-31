import { Request, Response } from "express";
import ShoppingListServices from "../services/ShoppingListServices";

const postList = async(req: Request, res: Response):Promise<void> => {
    const {listName} = req.body;
    if (!listName) {
        res.status(404).json({message: "nom manquant"})
    }
    try {
        const newlist = await ShoppingListServices.createList(listName);
        res.status(201).json({message:'liste créer', newlist})
    } catch (error) {
        console.error("Erreur lors de la création de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

const putList = async(req: Request, res: Response):Promise<void> => {
    const {idList, listName, idNbrIngredientOrDish} = req.body; 

    try {
        const updatedList = await ShoppingListServices.updateList(idList, listName, idNbrIngredientOrDish);
        res.status(200).json({message: "liste modifiée", updatedList})
    } catch (error) {
        console.error("Erreur lors de la modification de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }

}

const shoppingListController = {
    postList,
    putList
}

export default shoppingListController;