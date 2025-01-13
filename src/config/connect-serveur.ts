import express from 'express';
const serveur = express();
const port = process.env.PORT || 3000;
import productRoutes from '../routes/productRoutes';
import ingredientRoutes from '../routes/ingredientRoutes'
import recipeRoutes from '../routes/recipeRoutes'
import shoppingListRoutes from '../routes/shoppingListRoutes'
/**
 * Initializes and starts the server
 * Sets up JSON middleware and routes
 * @returns void
 */
function connectToServeur() {
    
    serveur.listen(port, () => {
        console.log(`Serveur lancé sur le port ${port}`);
    });
    serveur.use(express.json());
    
    serveurRoutes();
}

/**
 * Configures the server routes
 * Sets up endpoints for products, ingredients, recipes and shopping lists
 * @returns void
 */
function serveurRoutes() {
    serveur.use('/product', productRoutes);
    serveur.use('/ingredient', ingredientRoutes);
    serveur.use('/recipe', recipeRoutes)
    serveur.use('/list', shoppingListRoutes)
}
export { connectToServeur };