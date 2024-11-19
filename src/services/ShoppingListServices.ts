import path from "path";
import Dishes, { IDishes } from "../models/Dishes";
import NumberOfIngredients, { INumberOfIngredient } from "../models/NumberOfIngredient";
import ShoppingList, { IShoppingList } from "../models/ShoppingList";
import { formatIngredientName } from "../utils/formatedIngredientName"
import NumberOfIngredientsServices from "./NumberOfIngredientServices";
import Ingredient from "../models/Ingredient";

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

const updateList = async(idList: string, nameList: string, idNbrIngredientOrDish: string) => {

    if (!idList || !idNbrIngredientOrDish) {
        throw new Error("information manquante")
    }
    const list = await ShoppingList.findById(idList)
    .populate({
        path: "ingredient",
        populate : [
            {path: "ingredient", select: "-_id name"}
        ]
    });
    

    if (!list) {
        throw new Error("la list n'existe pas");
    }

    const disheOrNumberOfIngredientToAdd = await addIngredientToTheListByDishOrNbrIngredient(idNbrIngredientOrDish);

    if (list.ingredient && list.ingredient.length > 0) {
        const ingredientNameInTheList = list.ingredient.map(item => item.ingredient.name)

        // console.log(ingredientNameInTheList);
        for (const numberOfIngredientId of disheOrNumberOfIngredientToAdd.idIngredients) {
            const numberOfIngredientToAddOrUpdate = await NumberOfIngredients.findById(numberOfIngredientId)
            .populate('ingredient')
            .populate('unitOfMeasurement');

            if (!numberOfIngredientToAddOrUpdate) {
                throw new Error("Nombre d'ingrédient introuvable");
            }

            if (ingredientNameInTheList.includes(numberOfIngredientToAddOrUpdate.ingredient.name)) {

                const ingredientName = await Ingredient.find({name: numberOfIngredientToAddOrUpdate.ingredient.name});

                if (!ingredientName) {
                    throw new Error('ingredient non trouvé');
                }

                const ingredientId = ingredientName[0]._id;

                const allNumberOfIngredientHavingThisIngredientId = await NumberOfIngredients.find({ingredient: ingredientId});

                await ShoppingList.updateOne(
                    { _id: list._id, "ingredient": {$in: allNumberOfIngredientHavingThisIngredientId}},
                    {
                        $set: {
                            "ingredient.$.quantity": numberOfIngredientToAddOrUpdate.quantity, 
                            "ingredient.$.unitOfMeasurement": numberOfIngredientToAddOrUpdate.unitOfMeasurement
                        }    
                    }
                    )


                // NumberOfIngredientsServices.createNumberOfIngredients(numberOfIngredientToAddOrUpdate.ingredient._id as string, numberOfIngredientToAddOrUpdate.unitOfMeasurement._id as string, numberOfIngredientToAddOrUpdate.quantity as number)

                console.log(allNumberOfIngredientHavingThisIngredientId) 
            }
            

            // console.log(findNumberOfIngredient.ingredient.name);
            
        }
    }

    for(const numberOfIngredientId of disheOrNumberOfIngredientToAdd.idIngredients) {
        const numberOfIngredientToAdd = await NumberOfIngredients.findById(numberOfIngredientId)

        if (!numberOfIngredientToAdd) {
            throw new Error("nombre d'ingredient introuvable");           
        }

        NumberOfIngredientsServices.createNumberOfIngredients(numberOfIngredientToAdd.ingredient._id as string, numberOfIngredientToAdd.unitOfMeasurement._id as string, numberOfIngredientToAdd.quantity as number)


        

    }


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