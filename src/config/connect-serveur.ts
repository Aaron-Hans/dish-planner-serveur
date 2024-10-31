import express from 'express';
const serveur = express();
const port = process.env.PORT || 3000;
import productRoutes from '../routes/productRoutes';
import ingredientRoutes from '../routes/ingredientRoutes'
import recipeRoutes from '../routes/recipeRoutes'
import shoppingListRoutes from '../routes/shoppingListRoutes'
function connectToServeur() {

    
    serveur.listen(port, () => {
        console.log(`Serveur lancé sur le port ${port}`);
    });
    serveur.use(express.json());
    
    serveurRoutes();
}

function serveurRoutes() {
    serveur.use('/product', productRoutes);
    serveur.use('/ingredient', ingredientRoutes);
    serveur.use('/recipe', recipeRoutes)
    serveur.use('/list', shoppingListRoutes)
}
export { connectToServeur };