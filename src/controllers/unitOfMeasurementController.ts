import { UnitType } from '../models/UnitOfMeasurement';
import UnitOfMeasurementServices from '../services/UnitOfMeasurementServices'
import { Response, Request } from 'express'

const createUnitOfMeasurement = async (req: Request, res: Response): Promise<void> => {
    const {name} = req.body;
    try {
        const newUnitOfMeasurement = await UnitOfMeasurementServices.createUnitOfMeasurement(name);
        res.json(newUnitOfMeasurement);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
}

const findAllUnitOfMeasurement = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUnitOfMeasurement = await UnitOfMeasurementServices.findAllUnitOfMeasurement()
        res.json(allUnitOfMeasurement)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
}

const findUnitOFMeasurementByName = async (req: Request, res: Response): Promise<void> => {
    const {unitName} = req.params;
    try {
        const unitOFMeasurement = await UnitOfMeasurementServices.findUnitOfMeasurementByName(unitName as UnitType);
        res.json(unitOFMeasurement);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
};


const unitOfMeasurementController = {
    findAllUnitOfMeasurement,
    findUnitOFMeasurementByName,
    createUnitOfMeasurement
}

export default unitOfMeasurementController;