import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './logger';

dotenv.config();

/**
 * This function is use to connect you to the database
 * @returns void
 */
async function connectToTheDataBase() {
    try{
        const databaseUri = process.env.DATABASE_URI;
        if (!databaseUri) {
            logger.error("Erreur critique : base de données inaccessible le DATABASE_URI n'est pas défini");
            throw new Error("DATABASE_URI n'est pas défini");
        }
        await mongoose.connect(databaseUri);
        logger.info("Connexion à la base de donnée ok")
    } catch (error) {
        logger.error("connexion impossioble", {error})
        console.error(error)
    }
    
}
export {connectToTheDataBase}
