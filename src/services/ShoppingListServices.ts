import Dishes, { IDishes } from "../models/Dishes";
import NumberOfIngredients, { INumberOfIngredient } from "../models/NumberOfIngredient";
import ShoppingList, { IShoppingList } from "../models/ShoppingList";
import { formatIngredientName } from "../utils/formatedIngredientName"

const createList = async (listName?: string):Promise<IShoppingList> => {
    if (!listName) {
        listName = formatIngredientName("Ma liste de course");
    }
    listName = formatIngredientName(listName);
    console.log(listName);
    
    const newShoppingList = new ShoppingList({
        name: listName
    })

    await newShoppingList.save();
    return newShoppingList;
}

const updateList = async(idList: string, nameList: string, idNbrIngredientOrDish: string) => {

    if (!idList || !idNbrIngredientOrDish) {
        throw new Error("information manquante")
    }
    const list = await ShoppingList.findById(idList);

    
    if (!list) {
        throw new Error("la list n'existe pas");
    }
    console.log("list", list.ingredient);

    const result = await addIngredientToTheListByDishOrNbrIngredient(idNbrIngredientOrDish);
    if(list.ingredient) {
        const existingIngredients = list.ingredient.map((ingredient: any) => ingredient.toString());
        result.idIngredients = [...existingIngredients, ...result.idIngredients];
    }

    const updateData: any = {
        ingredient: result.idIngredients,
    };

    if (result.idDish) {
        updateData.dish = result.idDish;
    }

    if (nameList) {
        updateData.name = nameList;
    }

    const updatedList = await ShoppingList.findByIdAndUpdate(
        idList,
        updateData,
        { new: true }
    )

    return updatedList;

}

const addIngredientToTheListByDishOrNbrIngredient = async(idNbrIngredientOrDish: string): Promise<{idIngredients: string[], idDish?: string}> => {

    const isDish = await Dishes.exists({_id: idNbrIngredientOrDish});

    if (isDish) {
        const dish = await Dishes.findById(idNbrIngredientOrDish)
        .populate({
            path: "ingredient", 
            populate: [
                {path: 'ingredient', model: 'ingredients', select: "name"},
                {path: 'unitOfMeasurement', model: 'unit_of_measurement', select: "name"}
            ]
        });
        if (!dish) {
            throw new Error("Ingrédient introuvable");
        }
        const ingredientIds = dish.ingredient.map((ingredientDetail: any) => ingredientDetail.ingredient._id.toString());
        return {idIngredients: ingredientIds, idDish: idNbrIngredientOrDish};
    } else {
        const nbrOfIngredient = await NumberOfIngredients.findById(idNbrIngredientOrDish);
        if (!nbrOfIngredient) {
            throw new Error("Ingredient introuvable");
        }
        return {idIngredients: [idNbrIngredientOrDish]};
    }
}

export default {
    createList,
    updateList
}