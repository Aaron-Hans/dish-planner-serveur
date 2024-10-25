import express from 'express';
const router = express.Router();
import dishesController from '../controllers/dishesController';

router.post('/create-dishe', dishesController.createDishe);
router.get('/find-dish/:idDish', dishesController.findSingleDish);
router.get('/find-dishes', dishesController.findAllDishes);
router.put('/update-dishe', dishesController.updateDishe);
router.delete('/delete-dishe/:idDishe', dishesController.deleteDishe)

export default router;