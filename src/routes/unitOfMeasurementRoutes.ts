import express from 'express';
const router = express.Router();
import unitOfMeasurementController from '../controllers/unitOfMeasurementController';

router.post('/create-unit', unitOfMeasurementController.createUnitOfMeasurement);
router.get('/find-all-unit', unitOfMeasurementController.findAllUnitOfMeasurement);
router.get('/find-unit-by-name/:unitName', unitOfMeasurementController.findUnitOFMeasurementByName);

export default router;