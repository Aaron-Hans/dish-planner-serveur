import { error } from "console";
import Dishes, { IDishes } from "../models/Dishes"

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
        throw error('plat non trouvée');
    }
    console.log(dish)
    return dish
}
export default {getDish};