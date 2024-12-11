import { Request, Response } from 'express';
import NumberOfDishServices from '../services/NumberOfDishService';

const postNumberOfDish = async (req: Request, res: Response): Promise<void> => {
    const { idDish } = req.body;
    try {
        await NumberOfDishServices.createNumberOfDish(idDish);
        res.status(201).json({ message: 'Nombre de plats créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du nombre de plats' });
    }
}

const numberOfDishController = {
    postNumberOfDish,
}

export default numberOfDishController;