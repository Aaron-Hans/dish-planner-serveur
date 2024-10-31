import { Request, Response } from "express";
import ShoppingListServices from "../services/ShoppingListServices";
import ShoppingList from "../models/ShoppingList";

const postShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {shoppingListName} = req.body;
    if (!shoppingListName) {
        res.status(404).json({message: "nom manquant"})
    }
    try {
        const newShoppinglist = await ShoppingListServices.createShoppingList(shoppingListName);
        res.status(201).json({message:'liste créer', newShoppinglist})
    } catch (error) {
        console.error("Erreur lors de la création de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

const putShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList, shoppingListName, idNbrIngredientOrDish} = req.body; 

    try {
        const updatedList = await ShoppingListServices.updateShoppingList(idShoppingList, shoppingListName, idNbrIngredientOrDish);
        res.status(200).json({message: "liste modifiée", updatedList})
    } catch (error) {
        console.error("Erreur lors de la modification de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }

}

const deleteShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList} = req.params;
    try {
        const deleteShoppingList = await ShoppingList.findByIdAndDelete(idShoppingList);
        res.status(200).json({message: "liste de course supprimée", deleteShoppingList})
    } catch (error) {
        console.error("Erreur lors de la suppression de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

const getShoppingList = async(req: Request, res: Response):Promise<void> => {
    const {idShoppingList} = req.params;
    try {
        const list = await ShoppingListServices.findShoppingListById(idShoppingList);
        res.status(200).json({message: "liste récupérée", list})
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste d'ingrédients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

const getAllShoppingList = async (req: Request, res: Response): Promise<void> => {
    try {
        const allList = await ShoppingList.find();
        if (allList.length === 0) {
            res.status(404).json({message: "Aucune liste trouvé"});
        } else {
            res.status(200).json(allList);
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


const shoppingListController = {
    postShoppingList,
    putShoppingList,
    deleteShoppingList,
    getShoppingList,
    getAllShoppingList
}

export default shoppingListController;