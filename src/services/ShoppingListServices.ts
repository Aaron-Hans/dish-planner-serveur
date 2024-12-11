import Dishes from "../models/Dishes";
import NumberOfIngredients, { INumberOfIngredient } from "../models/NumberOfIngredient";
import ShoppingList, { IShoppingList, ShoppingListAction } from "../models/ShoppingList";
import { formatedProductName } from "../utils/formatedProductName"
import NumberOfIngredientsServices from "./NumberOfIngredientServices";
import Ingredient from "../models/Product";
import UnitOfMeasurement from "../models/UnitOfMeasurement";
import NumberOfDishService from "./NumberOfDishService";

const createList = async (listName?: string):Promise<IShoppingList> => {
    if (!listName) {
        listName = formatedProductName("Ma liste de course");
    }
    listName = formatedProductName(listName);
    
    const newShoppingList = new ShoppingList({
        name: listName
    })

    await newShoppingList.save();
    return newShoppingList;
}

const updateList = async(idList: string, nameList: string, idNbrIngredientOrDish: string, action?:ShoppingListAction) => {

    if (!idList || !idNbrIngredientOrDish) {
        throw new Error("information manquante")
    }
    const list = await ShoppingList.findById(idList)
    .populate({
        path: "ingredient",
        populate: [
            { path: "ingredient", select: "-_id name" },
            { path: "unitOfMeasurement", select: "name" }
        ]
    })
    .populate({
        path: "dish",
        populate: [
            { path: "dish", select: "id name" }
        ]
    });

    if (!list) {
        throw new Error("la list n'existe pas");
    }

    const disheOrNumberOfIngredientToAdd = await getNumberOfIngredientToAddToTheList(idNbrIngredientOrDish);

    let numberOfIngredientId; 
    let numberOfDishToAdd;

    if (disheOrNumberOfIngredientToAdd.idDish) {
        const dish = await Dishes.findById(disheOrNumberOfIngredientToAdd.idDish)

        if (!dish) {
            throw new Error("plat non trouvé");
        }

            list.dish.forEach((numberOfDishInList) =>  {

                if (numberOfDishInList.dish._id == disheOrNumberOfIngredientToAdd.idDish) {
                    console.log("BOOONJOUR");
                }
            })
            numberOfIngredientId = await addNewDishInShoppingListService(list,{
                idIngredients: disheOrNumberOfIngredientToAdd.idIngredients,
                idDish: disheOrNumberOfIngredientToAdd.idDish
            })

            numberOfDishToAdd = await NumberOfDishService.createNumberOfDish(disheOrNumberOfIngredientToAdd.idDish);

        const updateList = await ShoppingList.findByIdAndUpdate(
            list._id,
            {
                name: nameList,
                ingredient: numberOfIngredientId,
                dish: numberOfDishToAdd
            },
            {new: true}
        );
        if (!updateList) {
            throw new Error("Erreur lors de la mise à jour de la liste");           
        }
        return updateList
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
        populate: [
            {path: 'dish', model: 'dishes', select: "name"}
        ]
    });

    if (!list) {
        throw new Error("Liste introuvable");
    }
    return list;
}

const getNumberOfIngredientToAddToTheList = async(idNbrIngredientOrDish: string): Promise<{idIngredients: string[], idDish?: string}> => {
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


const addNewDishInShoppingListService = async(list: IShoppingList, dishToAdd: {idIngredients: string[], idDish: string | undefined}):Promise<string[]>=> {
    const createPromises = dishToAdd.idIngredients.map(async (numberOfIngredientId: string) => {
        const numberOfIngredient = await NumberOfIngredients.findById(numberOfIngredientId);

        if (!numberOfIngredient) {
            throw new Error("erreur lors de la récupération du nombre d'ingrédients");
        }

        const unit = await UnitOfMeasurement.findById(numberOfIngredient.unitOfMeasurement);

        if (!unit) {
            throw new Error("erreur lors de la récupération de l'unité");
        }

        const ingredient = await Ingredient.findById(numberOfIngredient.ingredient);

        if (!ingredient) {
            throw new Error("erreur lors de la récupération de l'ingrédient");
        }

        const newNumberOfIngredient = await NumberOfIngredientsServices.createNumberOfIngredients(ingredient._id as string, unit._id as string, numberOfIngredient.quantity as number);
        
        if (!newNumberOfIngredient._id) {
            throw new Error("Erreur lors de la création du nombre d'ingrédients");
        }

        return newNumberOfIngredient._id.toString();
    });
    
    return await Promise.all(createPromises);
}



export default {
    createList,
    updateList,
    findListById
}