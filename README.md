# comp308_lab2
 
Create a gaming tournaments and players system using the MERN stack with Express, GraphQL, and Apollo Server.

Requirements:

Express GraphQL API:
•	Develop an Express GraphQL API that supports CRUD operations for managing users, gaming tournaments, and players.
•	Create a User model with the following fields:
o	Username
o	Email
o	Password (hashed)
o	Role (Admin, Player)
•	Create a Player model with the following fields:
o	User (ObjectId reference to User model)
o	Ranking (number)
o	Tournaments (Array of ObjectId references to Tournament model)
•	Create a Tournament model with the following fields:
o	Name (string)
o	Game (string)
o	Date (date)
o	Players (Array of ObjectId references to Player model)
o	Status (Upcoming, Ongoing, Completed)
•	Implement authentication and authorization using JWT and HTTPOnly cookies.
•	Use GraphQL queries and mutations to fetch and modify data.

React Front-end:
•	Design a user-friendly React Vite UI using functional components, composition, and React Hooks.
•	Implement the following features for players:
o	Register/Login
o	View upcoming tournaments
o	Join a tournament
o	View their tournament history
•	Implement the following features for admin users:
o	Create users
o	Create tournaments
o	Assign players to tournaments
o	List all tournaments and players
•	Use Apollo Client for managing GraphQL data fetching.

MVC Architecture:
•	Apply the MVC (Model-View-Controller) principles for the Express API to ensure a structured and maintainable codebase.
•	Design a nice and friendly UI.
