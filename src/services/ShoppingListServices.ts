import Dishes, { IDishes } from "../models/Dishes";
import NumberOfIngredients, { INumberOfIngredient } from "../models/NumberOfIngredient";
import ShoppingList, { IShoppingList } from "../models/ShoppingList";
import { formatIngredientName } from "../utils/formatedIngredientName"
import NumberOfIngredientsServices from "./NumberOfIngredientServices";

const createList = async (listName?: string):Promise<IShoppingList> => {
    if (!listName) {
        listName = formatIngredientName("Ma liste de course");
    }
    listName = formatIngredientName(listName);
    
    const newShoppingList = new ShoppingList({
        name: listName
    })

    await newShoppingList.save();
    return newShoppingList;
}

const updateList = async(idList: string, nameList: string, idNbrIngredientOrDish: string): Promise<IShoppingList> => {

    if (!idList || !idNbrIngredientOrDish) {
        throw new Error("information manquante")
    }
    const list = await ShoppingList.findById(idList);

    if (!list) {
        throw new Error("la list n'existe pas");
    }

    const result = await addIngredientToTheListByDishOrNbrIngredient(idNbrIngredientOrDish);
    if(list.ingredient) {
        const existingIngredients = list.ingredient.map(ingredient => ingredient.toString());
        result.idIngredients.forEach(async newIngredient => {
            const existingIndex = existingIngredients.findIndex(
                existing => existing === newIngredient.toString()
            );
            if (existingIndex !== -1) {
                const ingredient = await NumberOfIngredients.findById(newIngredient) as INumberOfIngredient;
                if (!ingredient) {
                    throw new Error("Ingrédient introuvable");
                }
                await NumberOfIngredientsServices.addQuantityNumberOfIngredient(newIngredient, ingredient.ingredient.toString(), ingredient.unitOfMeasurement.toString(), Number(ingredient.quantity));
            } else {
                existingIngredients.push(newIngredient.toString());
            }
        });
        result.idIngredients = existingIngredients;
    }

    const updateData = {
        ingredient: result.idIngredients,
        ...(result.idDish && { dish: result.idDish }),
        ...(nameList && { name: formatIngredientName(nameList) })
    };

    const updatedList = await ShoppingList.findByIdAndUpdate(
        idList,
        updateData,
        { new: true }
    ).populate({
        path: "ingredient",
        populate: [
            {path: 'ingredient', model: 'ingredients', select: "name"},
            {path: 'unitOfMeasurement', model: 'unit_of_measurement', select: "name"}
        ]
    });

    if (!updatedList) {
        throw new Error("Erreur lors de la mise à jour de la liste");
    }

    return updatedList;
}

const addIngredientToTheListByDishOrNbrIngredient = async(idNbrIngredientOrDish: string): Promise<{idIngredients: string[], idDish?: string}> => {
    const isDish = await Dishes.exists({_id: idNbrIngredientOrDish});

    if (isDish) {
        const dish = await Dishes.findById(idNbrIngredientOrDish);
        if (!dish) {
            throw new Error("Plat introuvable");
        }
        const ingredientIds = dish.ingredient.map((ingredientDetail: INumberOfIngredient) => ingredientDetail.toString());
        return {idIngredients: ingredientIds, idDish: idNbrIngredientOrDish};
    } else {
        const nbrOfIngredient = await NumberOfIngredients.findById(idNbrIngredientOrDish);
        if (!nbrOfIngredient) {
            throw new Error("Ingredient introuvable");
        }
        return {idIngredients: [idNbrIngredientOrDish]};
    }
}

const findListById = async(idList: string): Promise<IShoppingList> => {
    if (!idList) {
        throw new Error("id de la liste manquant");
    }
    const list = await ShoppingList.findById(idList)
    .populate({
        path: "ingredient", 
        populate: [
            {path: 'ingredient', model: 'ingredients', select: "name"},
            {path: 'unitOfMeasurement', model: 'unit_of_measurement', select: "name"}
        ]
    })
    .populate({
        path: "dish",
        select: "name"
    });

    if (!list) {
        throw new Error("Liste introuvable");
    }
    return list;
}

export default {
    createList,
    updateList,
    findListById
}