import express from 'express';
const router = express.Router();
import numberOfIngredientController from '../controllers/numberOfIngredientController';

router.post('/create-number-of-ingredient', numberOfIngredientController.postNumberOfIngredient);
router.put('/update-number-of-ingredient', numberOfIngredientController.putNumberOfIngredient);
router.delete('/delete-number-of-ingredient/:idNumberOfIngredient', numberOfIngredientController.deleteNumberOfIngredient);

export default router;
