import express from 'express';
const serveur = express();
const port = process.env.PORT || 3000;
import unitOFMeasurementRoutes from '../routes/unitOfMeasurementRoutes';
import ingredientsRoutes from '../routes/ingredientRoutes';
import numberOfIngredientsRoutes from '../routes/numberOfIngredientRoutes'
import disheRoute from '../routes/disheRoutes'

function connectToServeur() {

    
    serveur.listen(port, () => {
        console.log(`Serveur lancé sur le port ${port}`);
    });
    serveur.use(express.json());
    
    serveurRoutes();
}

function serveurRoutes() {
    serveur.use('/unit', unitOFMeasurementRoutes); 
    serveur.use('/ingredient', ingredientsRoutes);
    serveur.use('/number', numberOfIngredientsRoutes);
    serveur.use('/dishe', disheRoute)
}
export { connectToServeur };