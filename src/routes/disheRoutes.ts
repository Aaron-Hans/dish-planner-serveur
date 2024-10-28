import express from 'express';
const router = express.Router();
import dishesController from '../controllers/dishesController';

router.post('/create-dishe', dishesController.postDish);
router.get('/find-dish/:idDish', dishesController.getSingleDish);
router.get('/find-dishes', dishesController.getAllDishes);
router.put('/update-dishe', dishesController.updateDish);
router.delete('/delete-dishe/:idDishe', dishesController.deleteDish)

export default router;