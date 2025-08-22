# PortFolium

PortFolium is a modern, interactive portfolio website that showcases professional skills through a dynamic project tracker and contemporary blog. The site emphasizes content discovery and visitor engagement while providing streamlined content management for a single user.

## Overview

PortFolium is built with a front-end and back-end architecture:

- **Frontend**: The frontend is built using ReactJS with Vite for a fast development environment. The user interface is styled with Tailwind CSS and components from the shadcn-ui library. Routing is handled by `react-router-dom`. The frontend communicates with the backend through API endpoints prefixed with `/api/`.

- **Backend**: The backend is built using Express.js to provide REST API endpoints. It supports MongoDB via Mongoose for database interactions. Token-based authentication is implemented using JWTs (JSON Web Tokens). The backend handles user authentication, project management, blog management, skills management, and more.

### Project Structure

The project is divided into two main parts:

1. **Frontend**: Located in the `client/` folder.
    - `client/src/`: Contains the source code for the frontend.
    - `client/src/pages/`: Contains page components.
    - `client/src/components/`: Contains reusable components.
    - `client/src/api/`: Contains API request definitions and mock data for development.

2. **Backend**: Located in the `server/` folder.
    - `server/routes/`: Contains route definitions for authentication, user profiles, blogs, projects, and skills.
    - `server/models/`: Contains Mongoose schema definitions.
    - `server/controllers/`: Contains the logic for handling API requests.
    - `server/services/`: Contains business logic and functions to interact with the database.

## Features

### Core Features

1. **Dynamic Project Tracker (Kanban-Style)**
    - Allows users to track projects in a visual, card-based layout.
    - Provides functionalities like drag-and-drop reorganization, filtering, and detailed project views.

2. **Contemporary Blog Platform**
    - Supports clean article layouts with optimal typography and media embedding.
    - Provides features for article discovery, social sharing, and user engagement through comments.

3. **Skills Showcase System**
    - Visual representation of skills using progress bars or rings.
    - Allows users to link skills with practical projects and display growth over time.

4. **Content Management Dashboard**
    - Offers a user-friendly administrative interface for managing content.
    - Includes tools for analytics, content creation, editing, and site health monitoring.

## Getting started

### Requirements

To run this project, you need to have the following installed on your computer:
- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (for database support)
- **Git** (for version control)

### Quickstart

Follow these steps to set up and run the project:

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm run start
    ```

The above command will start both the frontend and backend services. By default, the frontend runs on port 5173 and the backend on port 3000.

For user testing, access the frontend at `http://localhost:5173`.

### License

The project is proprietary. 

```text
Copyright (c) 2024.
```