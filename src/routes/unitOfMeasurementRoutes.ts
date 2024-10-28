import express from 'express';
const router = express.Router();
import unitOfMeasurementController from '../controllers/unitOfMeasurementController';

router.post('/post-unit', unitOfMeasurementController.postUnitOfMeasurement);
router.get('/get-unit-by-id/:unitId', unitOfMeasurementController.getUnitOFMeasurementById)
router.get('/find-all-unit', unitOfMeasurementController.getAllUnitOfMeasurement);
router.get('/find-unit-by-name/:unitName', unitOfMeasurementController.getUnitOFMeasurementByName);

export default router;