# social-todo-mern
The "Social Todo" app is a MERN stack-based web application. Users can create, edit, and delete their own todos, ensuring efficient organization of their personal tasks.Additionally, the app allows users to create a network of friends, view their friend's todos, and add tasks specifically for their friends. 

# Social Todo App

The Social Todo App is a web application built with a separate frontend and backend, utilizing the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides users with a platform to manage their todos, collaborate with friends, and enhance productivity.

## Features

1. **Authentication and Session Management**: The app includes a login and signup page for user authentication. It utilizes bcrypt for password hashing and JWT (JSON Web Tokens) for session management.

2. **Home Page**: The home page is where users can add, edit, and delete their todos. The page also features a side panel for managing friends in the network.

![Screenshot from 2023-07-14 18-11-50](https://github.com/JatinChopra/social-todo-mern/assets/67048953/c889fa81-b8ff-4ea1-a8bd-31b2bbe1c3bf)
  

3. **Friend Management**: Users can add friends to their network using the side panel. The friend management section has two tabs:
   - **Requests Tab**: Displays received and sent friend requests with their respective statuses.
   - **Friends Tab**: Shows a list of friends in the network.
     ![Screenshot from 2023-07-14 18-32-41](https://github.com/JatinChopra/social-todo-mern/assets/67048953/e2d88c3c-2479-40d4-8cad-e0d9e55e8ea1)


4. **View and Add Todos for Friends**: Clicking on a friend's name in the friends list allows users to view the friend's todos. Additionally, users can add new todos specifically for their friends.
![Screenshot from 2023-07-14 18-18-21](https://github.com/JatinChopra/social-todo-mern/assets/67048953/3e308f0a-b219-4b02-8057-ca4b5c713f76)



## Getting Started

1. Clone the repository:
   `git clone <repository_url>`
2. Install dependencies:
   `cd frontend`
   `npm install`

   `cd ../backend`
   `npm install`

3. Configure the backend:
   -- Create a MongoDB database and update the connection string in `backend/db/connectHandler.js`.
   -- Set the JWT secret key in `backend/.env`.

5. Start the frontend and backend servers:
   `cd frontend`
   `npm run dev`

   `cd ../backend`
   `nodemon server.js`
