import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function connectToTheDataBase() {
    try{
        const databaseUri = process.env.DATABASE_URI;
        if (!databaseUri) {
            throw new Error("DATABASE_URI n'est pas défini");
        }
        await mongoose.connect(databaseUri);
        console.log('Connexion ok')
    } catch (error) {
        console.error(error)
    }
    
}
export {connectToTheDataBase}
