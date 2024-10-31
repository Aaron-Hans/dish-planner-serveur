import Dishes, { IDishes } from "../models/Dishes"
import NumberOfIngredient, { INumberOfIngredient } from "../models/NumberOfIngredient";
import { formatIngredientName } from "../utils/formatedIngredientName";
import NumberOfIngredientServices from "./NumberOfIngredientServices";

const createDish = async (dishName: string, numbersOfIngredientsId: INumberOfIngredient[], numberOfPerson: number): Promise<IDishes> => {
    const formattedDishName = formatIngredientName(dishName) as string;
    const createPromises = numbersOfIngredientsId.map(async (numberOfIngredientId: INumberOfIngredient) => {
        if (!numberOfIngredientId.ingredient) {
            throw new Error("L'ingrédient n'est pas renseigné");
        }

        if (!numberOfIngredientId.unitOfMeasurement) {
            throw new Error("L'unité de mesure n'est pas renseignée");
        }

        if (!numberOfIngredientId.quantity) {
            throw new Error("La quantité n'est pas renseignée");
        }

        const ingredientId = numberOfIngredientId.ingredient.toString();
        const unitOfMeasurementId = numberOfIngredientId.unitOfMeasurement.toString();
        const quantity = Number(numberOfIngredientId.quantity);
        const createNumberOfIngredient = await NumberOfIngredientServices.createNumberOfIngredients(ingredientId, unitOfMeasurementId, quantity);

        if (!createNumberOfIngredient._id) {
            throw new Error("Erreur lors de la création du nombre d'ingrédients");
        }
        return createNumberOfIngredient._id;
    })
    const arrayOfNumberOfIngredientsId = await Promise.all(createPromises);

    const newDish = new Dishes({
        name: formattedDishName,
        ingredient: arrayOfNumberOfIngredientsId,
        numberOfPerson: numberOfPerson
    })
    await newDish.save();
    return newDish;
}

const getDish = async (idDish: string) : Promise<IDishes> => {

    const dish = await Dishes.findById(idDish)
    .populate({
        path: "ingredient",
        populate: [
            {path: 'ingredient', model: 'ingredients', select: "name"},
            {path: 'unitOfMeasurement', model: 'unit_of_measurement', select: "name"}
        ]
    });

    if (!dish) {
        throw new Error('plat non trouvée');
    }
    const ingredientIds = dish.ingredient.map((ingredientDetail: any) => ingredientDetail.ingredient._id).toString();
    console.log(ingredientIds)
    return dish
}

const modifyDish = async (dishId: string, dishName: string, numbersOfIngredients: INumberOfIngredient[], numberOfPerson: number): Promise<IDishes> => {
    if (!dishId) {
        throw new Error("ID du plat non renseigné");
    }

    if (!dishName) {
        throw new Error("Nom du plat non renseigné");
    }

    const formattedDishName = formatIngredientName(dishName);

    const dish = await Dishes.findById(dishId);

    if (!dish) {
        throw new Error("Plat non trouvé");
    }

    const updatePromises = dish.ingredient.map(async (numberOfIngredientIdInDish: INumberOfIngredient) => {
        if (!numberOfIngredientIdInDish) {
            throw new Error("ID du nombre d'ingrédients non renseigné");
        }
        const matchingNumberOfIngredientId = numbersOfIngredients.find(
            (updatedNumberOfIngredientId: INumberOfIngredient) => {
                return updatedNumberOfIngredientId._id?.toString() === numberOfIngredientIdInDish.toString()
            }
        );

        if (!matchingNumberOfIngredientId) {
            throw new Error("L'ingrédient avec l'ID spécifié n'a pas été trouvé dans la liste des ingrédients à mettre à jour");
        }

        const updateIdNumberOfIngredient = await NumberOfIngredient.findOneAndUpdate(
            { _id: numberOfIngredientIdInDish },
            {
                ingredient: matchingNumberOfIngredientId.ingredient,
                unitOfMeasurement: matchingNumberOfIngredientId.unitOfMeasurement,
                quantity: matchingNumberOfIngredientId.quantity
            },
            { new: true }
        );

        if (!updateIdNumberOfIngredient) {
            throw new Error("Objet numberOfIngredient introuvable");
        }
    });
    await Promise.all(updatePromises);

    const updateDish = await Dishes.findByIdAndUpdate(
        dishId,
        { 
            name: formattedDishName, 
            numberOfPerson: numberOfPerson 
        }, 
        { new: true }
    );
    if (!updateDish) {
        throw new Error("Erreur lors de la mise à jour du plat");
    }
    return updateDish;
}

const removeDish = async (idDish: string): Promise<void> => {
    const dish = await Dishes.findById(idDish);
    if (!dish) {
        throw new Error("Plat non trouvé");
    }

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
    
    const result = await Dishes.deleteOne({ _id: dish._id });
    if (result.deletedCount === 0) {
        throw new Error("Erreur lors de la suppression du plat");
    }
}
export default {getDish, createDish, modifyDish, removeDish};
