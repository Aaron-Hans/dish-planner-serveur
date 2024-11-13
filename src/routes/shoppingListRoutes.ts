import  express  from "express";
const router = express.Router();
import shoppingListController from "../controllers/ShoppingListController";

router.post('/post-list', shoppingListController.postList);
router.put('/put-list', shoppingListController.putList);
router.delete('/delete-list/:idList', shoppingListController.deleteList);
router.get('/get-list/:idList', shoppingListController.getList);
export default router;