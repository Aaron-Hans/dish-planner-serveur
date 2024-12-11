import express from 'express';
const router = express.Router();
import numberOfDishController from '../controllers/numberOfDishController';

router.post('/create-number-of-dish', numberOfDishController.postNumberOfDish);

export default router;