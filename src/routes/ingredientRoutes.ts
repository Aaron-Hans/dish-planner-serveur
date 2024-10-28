import express from 'express';
const router = express.Router();
import ingredientsController from '../controllers/ingredientsController';

router.post('/post-ingredient', ingredientsController.postIngredient);
router.put('/put-ingredient', ingredientsController.putIngredient);
router.get('/get-all-ingredient', ingredientsController.getAllIngredients);
router.get('/get-ingredient-by-name/:ingredientName', ingredientsController.getIngredientByName);
router.get('/get-ingredient-by-id/:idIngredient', ingredientsController.getIngredientById);
router.delete('/delete-ingredient-by-name/:idIngredient', ingredientsController.deleteIngredientByName);

export default router;
