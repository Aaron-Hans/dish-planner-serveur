import  express  from "express";
const router = express.Router();
import shoppingListController from "../controllers/ShoppingListController";

router.post('/post-list', shoppingListController.postList);
router.put('/put-list', shoppingListController.putList);

export default router;