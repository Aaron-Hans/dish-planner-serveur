import { Request, Response } from "express";
import { formatIngredientName } from "../utils/formatedIngredientName";
import NumberOfIngredientServices from "../services/NumberOfIngredientServices";
import Dishes, { IDishes } from "../models/Dishes";
import DishesServices from "../services/DisheServices";
import NumberOfIngredient, { INumberOfIngredient } from "../models/NumberOfIngredient";

const createDishe = async (req: Request, res: Response): Promise<void> => {
    let {name, numbersOfIngredients, numberOfPerson} = req.body;
    name = formatIngredientName(name) as string;
    let arrayOfNumberOfIngredientsId: INumberOfIngredient[] = [];
    try {
        const createPromises = numbersOfIngredients.map(async ({ ingredient, unitOfMeasurement, quantity }: { ingredient: string, unitOfMeasurement: string, quantity: number }) => {
            if (!ingredient || !unitOfMeasurement || !quantity) {
                throw new Error("Données d'ingrédient incomplètes");
            }
            const numbersOfIngredientsIds = await NumberOfIngredientServices.newNumberOfIngredients(ingredient, unitOfMeasurement, quantity);
            if (numbersOfIngredientsIds && numbersOfIngredientsIds._id) {
                return numbersOfIngredientsIds._id as INumberOfIngredient;
            } else {
                throw new Error("Erreur lors de la création du nombre d'ingrédients");
            }
        });

        arrayOfNumberOfIngredientsId = await Promise.all(createPromises);

        const newDishes: IDishes = new Dishes({
            name: name,
            ingredient: arrayOfNumberOfIngredientsId,
            numberOfPerson: numberOfPerson,
        });
        await newDishes.save();
        res.status(201).json({message: "Plat créé avec succès"});
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
}

const findSingleDish = async(req:Request, res:Response):Promise<void> => {
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

const findAllDishes = async(req:Request, res:Response):Promise<void> => {
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

const updateDishe = async (req: Request, res: Response): Promise<void> => {
    const { disheId, name, numbersOfIngredients, numberOfPerson } = req.body;
    const formattedName = formatIngredientName(name);
    const dishe = await Dishes.findById(disheId);

    if (!dishe) {
        res.status(404).json({ message: "Plat introuvable" });
        return;
    }

    try {
        const updatePromises = dishe.ingredient.map(async (idNumberIngredient) => {
            if (!idNumberIngredient) {
                throw new Error("ID Number ingredient introuvable");
            }

            const matchingIngredient = numbersOfIngredients.find(
                (updatedIngredient: INumberOfIngredient) => updatedIngredient._id == idNumberIngredient
            );

            if (matchingIngredient) {
                const updateIdNumberOfIngredient = await NumberOfIngredient.findOneAndUpdate(
                    { _id: idNumberIngredient },
                    {
                        ingredient: matchingIngredient.ingredient,
                        unitOfMeasurement: matchingIngredient.unitOfMeasurement,
                        quantity: matchingIngredient.quantity
                    },
                    { new: true }
                );

                if (!updateIdNumberOfIngredient) {
                    throw new Error("Objet numberOfIngredient introuvable");
                }
            }
        });

        await Promise.all(updatePromises);

        await Dishes.findByIdAndUpdate(
            disheId,
            {
                name: formattedName,
                numberOfPerson: numberOfPerson
            },
            { new: true }
        );

        res.status(200).json({ message: "Plat mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur interne du serveur", details: error.message });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur inattendue" });
        }
    }
};

const deleteDishe = async (req: Request, res: Response): Promise<void> => {
    const { idDishe } = req.params;

    const dish = await Dishes.findById(idDishe);

    if (!dish) {
        res.status(404).json({ message: "Plat non trouvé" });
        return;
    }

    try {
        const deletePromises = dish.ingredient.map(async (idNumberIngredient) => {
            if (!idNumberIngredient) {
                throw new Error('ID Number ingredient introuvable');
            }

            const result = await NumberOfIngredient.deleteOne({ _id: idNumberIngredient });

            if (result.deletedCount === 0) {
                throw new Error("Erreur lors de la suppression de l'ingrédient");
            }
        });

        await Promise.all(deletePromises);

        await Dishes.deleteOne({ _id: dish._id });

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
    createDishe,
    updateDishe,
    deleteDishe,
    findSingleDish,
    findAllDishes
}

export default dishesController;
