import { UnitType } from '../models/UnitOfMeasurement';
import UnitOfMeasurementServices from '../services/UnitOfMeasurementServices'
import { Response, Request } from 'express'

const postUnitOfMeasurement = async (req: Request, res: Response): Promise<void> => {
    const {unitName} = req.body;
    try {
        const newUnitOfMeasurement = await UnitOfMeasurementServices.createUnitOfMeasurement(unitName);
        res.status(201).json(newUnitOfMeasurement);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
}

const getAllUnitOfMeasurement = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUnitOfMeasurement = await UnitOfMeasurementServices.findAllUnitOfMeasurement();
        console.log(allUnitOfMeasurement)
        res.status(200).json(allUnitOfMeasurement)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
}

const getUnitOFMeasurementByName = async (req: Request, res: Response): Promise<void> => {
    const {unitName} = req.params;
    try {
        const unit = await UnitOfMeasurementServices.findUnitOfMeasurementByName(unitName as UnitType);
        res.status(200).json(unit)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }
    }
};

const getUnitOFMeasurementById = async (req: Request, res: Response): Promise<void> => {
    const {unitId} = req.params;

    try {
        const unit = await UnitOfMeasurementServices.findUnitOfMeasurementById(unitId);
        res.status(200).json(unit)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "Erreur interne du serveur inattendue"});
        }       
    }
}


const unitOfMeasurementController = {
    getAllUnitOfMeasurement,
    getUnitOFMeasurementByName,
    postUnitOfMeasurement,
    getUnitOFMeasurementById
}

export default unitOfMeasurementController;