# Airbnb clone--Guestay

[![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#) [![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3)](#) [![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](#) [![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white)](#) [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](#) [![Express](https://img.shields.io/badge/-Express-191919?style=flat-square&logo=express&logoColor=white)](#) [![Sequelize](https://img.shields.io/badge/-Sequelize-00BFFF?style=flat-square&logo=sequelize&logoColor=white)](#) [![JavaScript ES6](https://img.shields.io/badge/-JavaScript%20ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=white)](#)

**Guestay** is a a cutting-edge vacation rental platform inspired by **Airbnb**. With this full-stack web application you can look for vacation rentals or become a host and rent your own property. This web application was built with Nodejs, Express, Sequelize and PostgreSQL for the backend, and React Redux for the frontend. Guestay combines top-notch technology with a user-friendly interface to deliver an exceptional rental experience. Check out the live link of **[Guestay](https://airbnb-clone-project-0jlv.onrender.com/)** to see it in action.

## :computer: Technologies Used :computer:

Backend:

- **Node.js**
- **Express**
- **Sequelize**
- **PostgreSQL**

Frontend:

- **HTML**
- **CSS**
- **JavaScript**
- **React**
- **Redux**

## :sparkles: Features :sparkles:

- Browse all available spots and view individual spot in detail
- View all spots owned by the current login user
- Create a new spot to start hosting
- Modify an existing spot
- Delete a spot
- Add / Remove images from a spot
- Read all reviews for a spot
- View all reviews written by the current login user
- Add/Edit/Delete a review for a spot by the current user
- Add /Remove images for a review

## Run locally

To run the application locally, please follow the steps below:

1.  Clone the repository:
    ```bash
    git clone https://github.com/Iris06-cs/Airbnb-clone
    ```
2.  Install dependencies for backend and frontend
    Backend:

    ```bash
    cd backend
    npm install
    ```

    Create a **.env** file to setup environment variables refer to the example.env file and execute the following shell script to migrate and seed the database:

    ```bash
     sh db-commands.sh
    ```

    Frontend:

    ```bash
    cd frontend
    npm install
    ```

3.  Start and run the App in both backend and frontend directores:
    ```bash
    npm start
    ```

## Document list

[API Routes Documentation](https://github.com/Iris06-cs/Airbnb-clone/blob/main/backend/README.md)

[Database Schema](https://github.com/Iris06-cs/Airbnb-clone/blob/main/backend/database-schema.png)

[Redux Store Tree](https://github.com/Iris06-cs/Airbnb-clone/blob/main/frontend/Redux-store-tree.png)

[Feature list](https://github.com/Iris06-cs/Airbnb-clone/blob/main/frontend/feature-list.md)

[Frontend Routes Documentation](https://github.com/Iris06-cs/Airbnb-clone/blob/main/frontend/frontend-routes.md)

## To-dos

- Complete Booking and search features
- Use AWS to store Images in the cloud
- Use Google API to show actual location for each spot
