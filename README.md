# COMP308 Lab 2

Create a gaming tournaments and players system using the MERN stack with Express, GraphQL, and Apollo Server.

## Requirements

### Express GraphQL API
- Develop an **Express GraphQL API** that supports CRUD operations for managing users, gaming tournaments, and players.
- Create a **User** model with the following fields:
  - `username` (string)
  - `email` (string)
  - `password` (hashed string)
  - `role` (enum: Admin, Player)
- Create a **Player** model with the following fields:
  - `user` (ObjectId reference to the User model)
  - `ranking` (number)
  - `tournaments` (array of ObjectId references to the Tournament model)
- Create a **Tournament** model with the following fields:
  - `name` (string)
  - `game` (string)
  - `date` (date)
  - `players` (array of ObjectId references to the Player model)
  - `status` (enum: Upcoming, Ongoing, Completed)
- Implement **authentication and authorization** using JWT and HTTPOnly cookies.
- Use **GraphQL queries and mutations** to fetch and modify data.

### React Front-End
- Design a user-friendly **React Vite UI** using functional components, composition, and React Hooks.
- Implement the following features for **players**:
  - Register/Login
  - View upcoming tournaments
  - Join a tournament
  - View their tournament history
- Implement the following features for **admin users**:
  - Create users
  - Create tournaments
  - Assign players to tournaments
  - List all tournaments and players
- Use **Apollo Client** for managing GraphQL data fetching.

### MVC Architecture
- Apply the **MVC (Model-View-Controller)** principles for the Express API to ensure a structured and maintainable codebase.
- Design a clean and friendly UI.

---

## How to Run the Project

### Backend (Express GraphQL API)
1. Navigate to the backend directory:
   ```bash
   cd graphql-server
