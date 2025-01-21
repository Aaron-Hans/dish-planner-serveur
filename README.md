
# DishPlanneurServeur

DishPlanneurServeur est une application serveur qui aide les utilisateurs à créer leur liste de courses en ajoutant directement des ingrédients ou des plats. Lorsqu'un plat est ajouté, les ingrédients nécessaires sont automatiquement ajoutés à la liste de courses.

## Base de données

Le projet utilise **MongoDB** comme base de données, avec le package **Mongoose** pour gérer les modèles et interactions.

## Tests API

Pour tester les appels API, nous utilisons **Postman**. Vous pouvez importer le fichier `Postman-DishPlanner` dans Postman pour accéder aux configurations nécessaires.

## Objectif

L'application a pour but d’être présentée aux entreprises dans le cadre de ma recherche d’alternance pour ma deuxième année de Master à l’EPSI Lille, qui se termine en septembre 2025. Ce projet est développé sur mon temps libre en parallèle de mes cours et de mon alternance actuelle.

## Développement à venir

- **Tests API** : Les tests seront prochainement ajoutés pour garantir la fiabilité et la robustesse de l'application.
- **Descriptions pour les recettes** : Chaque recette disposera bientôt d'une description détaillée.
- **Ajout d'images** : Les entités **Product** et **Recipe** auront bientôt la possibilité d'intégrer des images pour une meilleure expérience utilisateur.
- **Front-end** : Une interface utilisateur est en cours de préparation. Le front-end sera développé en utilisant **Flutter**, pour offrir une expérience multiplateforme moderne et réactive.

## Installation

Pour installer l'application, suivez les étapes ci-dessous :

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Aaron-Hans/dish-planner-serveur
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Utilisation

Pour démarrer l'application, utilisez la commande suivante :

```bash
npm run dev
```

## Licence

L'application est sous licence ISC.

## Contact

Pour toute question ou problème, vous pouvez contacter le développeur par email à l'adresse suivante : Hansaaron@outlook.fr
