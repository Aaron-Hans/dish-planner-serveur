import express from 'express';
const router = express.Router();
import productController from '../controllers/productController';

router.post('/post', productController.postProduct);
router.put('/put', productController.putProduct);
router.get('/get-all', productController.getAllProducts);
router.get('/get-by-name/:productName', productController.getProductByName);
router.get('/get-by-id/:idProduct', productController.getProductById);
router.delete('/delete/:idProduct', productController.deleteProductByName);

export default router;
