import express from 'express';
const router = express.Router();
import productController from '../controllers/productController';

router.post('/post-product', productController.postProduct);
router.put('/put-product', productController.putProduct);
router.get('/get-all-product', productController.getAllProducts);
router.get('/get-product-by-name/:productName', productController.getProductByName);
router.get('/get-product-by-id/:idProduct', productController.getProductById);
router.delete('/delete-product-by-name/:idProduct', productController.deleteProductByName);

export default router;
