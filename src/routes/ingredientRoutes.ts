import express from 'express';
const router = express.Router();
import ingredientController from '../controllers/ingredientController';

router.post('/post', ingredientController.postIngredient);
router.put('/update', ingredientController.putIngredient);
router.delete('/delete/:ingredientId', ingredientController.deleteIngredient);

export default router;
