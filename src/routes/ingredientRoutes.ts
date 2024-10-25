import express from 'express';
const router = express.Router();
import ingredientsController from '../controllers/ingredientsController';

router.post('/post-ingredient', ingredientsController.postIngredient);
router.put('/update-ingredient', ingredientsController.updateIngredient);
router.get('/find-all-ingredient', ingredientsController.findAllIngredients);
router.get('/find-ingredient-by-name/:name', ingredientsController.findIngredientByName);
router.get('/find-ingredient-by-id/:idIngredient', ingredientsController.findIngredientById);
router.delete('/delete-ingredient-by-name/:ingredientToDelete', ingredientsController.deleteIngredientByName);

export default router;
