import { INumberOfDish } from "../models/NumberOfDish";
import NumberOfDish from "../models/NumberOfDish"

const createNumberOfDish = async (idDish: string):Promise<INumberOfDish> => {
    if (!idDish) {
        throw new Error('Plat introuvable');
    }
    const newNumberOfDish: INumberOfDish = new NumberOfDish({
        dish: idDish,
        numberOfDish: 1
    })

    await newNumberOfDish.save()

    return newNumberOfDish;
}

export default{
    createNumberOfDish,
}