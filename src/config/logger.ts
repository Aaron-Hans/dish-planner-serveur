import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info', // Niveau de logs : 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // Inclut les traces des erreurs
        format.splat(), // Permet l'utilisation de variables dynamiques dans les messages
        format.json() // Format JSON pour faciliter la lecture par des outils externes
    ),
    transports: [
        new transports.Console({ // Affiche les logs dans la console
            format: format.combine(
                format.colorize(), // Ajoute des couleurs pour les niveaux
                format.simple() // Format simple pour la console
            )
        }),
        new transports.File({ filename: 'logs/app.log' }) // Sauvegarde les logs dans un fichier
    ]
});

export default logger;
