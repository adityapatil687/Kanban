![Screenshot (5)](https://github.com/user-attachments/assets/086181bc-366b-40ce-9457-df4795197bec)
<img width="959" alt="Screenshot 2025-03-05 001938" src="https://github.com/user-attachments/assets/0b4235e1-c5db-42a4-bf48-afaa4a532d77" />

# Kanban Task Manager

A simple **Kanban-style task manager** built using **React, Node.js, Express, and MongoDB**.

## Features

✅ Create, update, and delete tasks  
✅ Organize tasks by status (To Do, In Progress, Done)   
✅ Assign priorities and due dates   

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **State Management:** React Context

## Installation

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/kanban-task-manager.git
   cd kanban-task-manager
   ```
2. Install dependencies:
   ```sh
   cd server
   npm install
   ```
3. Create a `.env` file in the `server` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd kanban
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```

## API Endpoints

| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/api/auth/register`    | Register a new user       |
| POST   | `/api/auth/login`       | Login user and get token  |
| GET    | `/api/boards`           | Get all boards            |
| POST   | `/api/boards`           | Create a new board        |
| GET    | `/api/boards/:id`       | Get a specific board      |
| POST   | `/api/boards/:id/tasks` | Add a task to a board     |
| PUT    | `/api/tasks/:taskId`    | Update a task             |
| DELETE | `/api/tasks/:taskId`    | Delete a task             |



## Future Improvements
- Real-time updates using WebSockets
- User roles & permissions
- Drag-and-drop support for tasks
- Collaborative work
