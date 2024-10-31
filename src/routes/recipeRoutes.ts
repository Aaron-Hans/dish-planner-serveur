import express from 'express';
const router = express.Router();
import recipeController from '../controllers/recipeController';

router.post('/create', recipeController.postRecipe);
router.get('/find/:recipeId', recipeController.getRecipe);
router.get('/find-all', recipeController.getAllRecipes);
router.put('/update', recipeController.updateRecipe);
router.delete('/delete/:recipeId', recipeController.deleteRecipe)

export default router;