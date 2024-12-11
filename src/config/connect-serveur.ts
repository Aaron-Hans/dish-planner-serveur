import express from 'express';
const serveur = express();
const port = process.env.PORT || 3000;
import unitOFMeasurementRoutes from '../routes/unitOfMeasurementRoutes';
import productRoutes from '../routes/productRoutes';
import numberOfIngredientsRoutes from '../routes/numberOfIngredientRoutes'
import disheRoutes from '../routes/disheRoutes'
import shoppingListRoutes from '../routes/shoppingListRoutes'
import numberOfDishRoutes from '../routes/numberOfDishRoutes'
function connectToServeur() {

    
    serveur.listen(port, () => {
        console.log(`Serveur lancé sur le port ${port}`);
    });
    serveur.use(express.json());
    
    serveurRoutes();
}

function serveurRoutes() {
    serveur.use('/unit', unitOFMeasurementRoutes); 
    serveur.use('/product', productRoutes);
    serveur.use('/number', numberOfIngredientsRoutes);
    serveur.use('/dishe', disheRoutes)
    serveur.use('/list', shoppingListRoutes)
    serveur.use('/dish', numberOfDishRoutes)
}
export { connectToServeur };