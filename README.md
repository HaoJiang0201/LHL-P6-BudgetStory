# Budget Story
Budget Story allows users to categorize their incomes and expenses. Categories can be created and sub categories can be nested within each other any number of times. Users can then navigate their finances by clicking on categories on a pie chart, which will render the subcategories of the chosen category. Each category will display the total value of all expenses of any category within that category. Users can view records by date and compare weeks and months to one another.

Created By:
* [Hao Jiang](https://github.com/HaoJiang0201)
* [Brendan Lee](https://github.com/boksul)
* [Nick Newburg](https://github.com/nnewburg)

## Tech Stack
* Express
* React
* Postgres


## Prerequisites
In order to run this project node.js and npm both need to have been installed.

## Deployment
1. Clone this repo
2. npm install within the main directory
3. npm install within the client directory
4. From the command line run knex migrate:latest
5. From the command line run knex seed:run
6. Run `npm run start` from the main directory
8. Run `CHOKIDAR_USEPOLLING=true npm start` from the client directory
9. Visit http://localhost:3000/

## Navigating the application

After seeding the database the categories will be managed from the categories page. The root categories Incomes and Expenses cannot be edited or deleted, new categories or records can also not be created on this level. Double click on Incomes or Expenses to be enabled to begin making new categories.

## Screenshots
![Screenshot of Budgestory](https://github.com/HaoJiang0201/LHL-P6-Budgestory/blob/master/doc/Budget%20Story%20Track%20Page.jpg?raw=true)
![Screenshot of Budgestory](https://github.com/HaoJiang0201/LHL-P6-Budgestory/blob/master/doc/Budget%20Story%20Manage%20Page.jpg?raw=true)

## Built With
* [React]
* [Express]
* [React-Router]
* [Axios]
* [React-Bootstrap]
* [React-date-picker]
* [Highcharts]
* [Highcharts-drilldown]
* [Highcharts-react]
* [Knex]
* [Post-Gres]

