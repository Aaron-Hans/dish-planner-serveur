import express from 'express';
import productController from '../controllers/productController';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/post', upload.single("file"), productController.postProduct);
router.put('/put', productController.putProduct);
router.get('/get-all', productController.getAllProducts);
router.get('/get-by-name/:productName', productController.getProductByName);
router.get('/get-by-id/:idProduct', productController.getProductById);
router.delete('/delete/:idProduct', productController.deleteProductByName);

export default router;
