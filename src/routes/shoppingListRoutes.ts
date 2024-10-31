import  express  from "express";
const router = express.Router();
import shoppingListController from "../controllers/ShoppingListController";

router.post('/post', shoppingListController.postShoppingList);
router.put('/put', shoppingListController.putShoppingList);
router.delete('/delete/:idShoppingList', shoppingListController.deleteShoppingList);
router.get('/get/:idShoppingList', shoppingListController.getShoppingList);
router.get('/get-all', shoppingListController.getAllShoppingList);
export default router;