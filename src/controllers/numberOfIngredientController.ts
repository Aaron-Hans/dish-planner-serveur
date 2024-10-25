import UnitOfMeasurement from '../models/UnitOfMeasurement';
import NumberOfIngredients, { INumberOfIngredient } from '../models/NumberOfIngredient';
import Ingredient  from '../models/Ingredient';
import { measurmentConvertor } from '../utils/unitConversion';
import { Request, Response } from 'express';
import { formatIngredientName } from '../utils/formatedIngredientName';
import { initiateUnite } from '../utils/initiateUnite';


const createNumberOfIngredient = async (req: Request, res: Response): Promise<void> => {
    const { unitOfMeasurement, quantity } = req.body;
    let {ingredient} = req.body
    ingredient = formatIngredientName(ingredient);
    try {
        const foundUnit = await UnitOfMeasurement.findOne({ name: unitOfMeasurement });
        const foundIngredient = await Ingredient.findOne({ name: ingredient });
        if (!foundUnit || !foundIngredient) {
            res.status(404).json({ message: "Ingrédient ou Unité non trouvé" });
            return;
        }
        const initializedUnite = initiateUnite(quantity, unitOfMeasurement);
        
        if (foundIngredient._id && foundUnit._id) {

            const newNumber: INumberOfIngredient = new NumberOfIngredients({
                ingredient: foundIngredient._id.toString(),
                unitOfMeasurement: foundUnit._id.toString(),
                quantity: initializedUnite.quantity
            });
        
            await newNumber.save();
            res.status(201).json({ message: "Nombre d'ingrédients créé avec succès" });
        }
        else {
            res.status(400).json({ message: "Données d'ingrédient ou d'unité invalides" });
        }
    } catch (error) {
        console.error("Erreur lors de la création du nombre d'ingrédients:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateNumberOfIngredient = async (req:Request, res:Response): Promise<void> => {
    const {idIngredient, idNumberOfIngredient, idTargetUnit, idUnitOfMeasurement, quantity} = req.body;

    try {
        const foundNumberOfIngredient = await NumberOfIngredients.findById(idNumberOfIngredient)
        const foundIngredient = await Ingredient.findById(idIngredient)
        const foundUnit  = await UnitOfMeasurement.findById(idUnitOfMeasurement)
        const foundUnitTarget = await UnitOfMeasurement.findById(idTargetUnit)

        if (!foundNumberOfIngredient) {
            res.status(404).json({message: "Nombre d'ingredient introuvable"})
            return
        }

        if (!foundIngredient) {
            res.status(404).json({message: "Ingredient introuvable"})
            return
        }

        if (!foundUnit) {
            res.status(404).json({message: "Unité introuvable"})
            return
        }
        if (!foundUnitTarget) {
            res.status(404).json({message: "target unité introuvable"})
            return
        }

        const updatedValueAndUnit = measurmentConvertor(quantity, foundUnit.name, foundUnitTarget.name);

        if (!updatedValueAndUnit) {
            res.status(400).json({ message: "Quantité ou unité invalides" });
            return
        }

        const updatedUnit = await UnitOfMeasurement.findOne({name: updatedValueAndUnit.unit})

        if (!updatedUnit) {
            res.status(404).json({message: "nouvelle unité convertie introuvable"})
            return
        }

        await NumberOfIngredients.updateOne({_id: foundNumberOfIngredient._id},{$set: {ingredient: foundIngredient._id, unitOfMeasurement: updatedUnit._id, quantity: updatedValueAndUnit.quantity}})
        res.status(200).json({message: "ingredient modifier"})
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const deleteNumberOfIngredient = async (req:Request, res: Response): Promise<void> => {
    const {idNumberOfIngredient} = req.params 
    const numberOfIngredientToDelete = await NumberOfIngredients.findById(idNumberOfIngredient);

    if (!numberOfIngredientToDelete) {
        res.status(404).json({message:"Le nombre d'ingrédient à supprimer est introuvalbe"})
        return
    }
    try {
        await NumberOfIngredients.deleteOne({_id: numberOfIngredientToDelete._id})   
        res.status(200).json({message: "l'ingredient à été supprimer"})
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}


const numberOfIngredientController = {
    createNumberOfIngredient,
    updateNumberOfIngredient,
    deleteNumberOfIngredient
};

export default numberOfIngredientController;
