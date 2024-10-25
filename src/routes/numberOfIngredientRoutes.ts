import express from 'express';
const router = express.Router();
import numberOfIngredientController from '../controllers/numberOfIngredientController';

router.post('/create-number-of-ingredient', numberOfIngredientController.createNumberOfIngredient);
router.put('/update-number-of-ingredient', numberOfIngredientController.updateNumberOfIngredient);
router.delete('/delete-number-of-ingredient/:idNumberOfIngredient', numberOfIngredientController.deleteNumberOfIngredient);

export default router;
