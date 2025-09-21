# My Fullstack App

This is a fullstack application consisting of a frontend built with React and a backend powered by Node.js. The application is designed to be hosted on Vercel, providing a seamless experience for users.

## Project Structure

The project is organized into three main directories:

- **frontend**: Contains the React application.
  - **src**: Source code for the frontend application.
    - **app**: Main application layout and entry point.
    - **components**: Reusable UI components.
    - **lib**: Utility functions.
    - **types**: TypeScript types and interfaces.
  - **public**: Static assets such as images and icons.
  - **package.json**: Configuration for frontend dependencies and scripts.
  - **tsconfig.json**: TypeScript configuration for the frontend.
  - **README.md**: Documentation for the frontend.

- **backend**: Contains the Node.js backend application.
  - **src**: Source code for the backend application.
    - **controllers**: Functions to handle incoming requests.
    - **models**: Data models representing database entities.
    - **routes**: API routes linking endpoints to controllers.
    - **services**: Business logic and interactions with models.
  - **package.json**: Configuration for backend dependencies and scripts.
  - **tsconfig.json**: TypeScript configuration for the backend.
  - **README.md**: Documentation for the backend.

- **database**: Contains the SQL schema for setting up the database.
  - **schema.sql**: SQL definitions for tables and relationships.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-fullstack-app
   ```

2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Install dependencies for the backend:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up the database using the schema provided in `database/schema.sql`.

## Features

- Fullstack architecture with a React frontend and Node.js backend.
- Reusable UI components for a consistent user experience.
- Utility functions for common tasks in the frontend.
- Well-defined API routes for handling requests in the backend.
- TypeScript support for type safety and better development experience.

## Usage

To run the frontend and backend applications, use the following commands:

- For the frontend:
  ```bash
  cd frontend
  npm run dev
  ```

- For the backend:
  ```bash
  cd backend
  npm run dev
  ```

Visit `http://localhost:3000` for the frontend and the appropriate port for the backend API.

## License

This project is licensed under the MIT License.