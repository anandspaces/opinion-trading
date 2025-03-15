# Opinion Trading Platform

A full-stack application for trading opinions on real-world events with real-time updates.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### Backend
- Secure JWT Authentication
- Event Management (Create, Update, Resolve)
- Real-time WebSocket Updates
- Trade Execution & Settlement
- MongoDB Data Storage
- Admin Dashboard Endpoints
- Automated Event Resolution

### Frontend
- User Registration & Authentication
- Real-time Event Display
- Trade Placement Interface
- Admin Dashboard for Event Management
- Balance & Transaction Management
- Responsive UI with Tailwind CSS
- WebSocket Integration for Live Updates

## Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Socket.io**
- **JWT Authentication**

### Frontend
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Socket.io**
- **Vite**

## Installation

Clone the repository:
```bash
git clone https://github.com/anandspaces/opinion-trading.git
cd opinion-trading
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Configuration

Create a `.env` file in the `backend/` directory and add the following:
```ini
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=your_frontend_url
PORT=5000
```

## Docker Setup (Optional)

Ensure you have [Docker](https://www.docker.com/) installed on your machine.

### Build and Run Containers
```bash
docker-compose up --build
```

### Stopping Containers
```bash
docker-compose down
```

### Running in Detached Mode
```bash
docker-compose up -d
```

### Docker Files Structure
```plaintext
backend/
├── Dockerfile       # Docker setup for backend
├── .dockerignore    # Ignored files for backend container

frontend/
├── Dockerfile       # Docker setup for frontend
├── .dockerignore    # Ignored files for frontend container

root/
├── docker-compose.yml  # Docker Compose for managing services
```

## Project Structure

```plaintext
backend/
├── src/
│   ├── controllers/   # Route handlers
│   ├── models/        # MongoDB schemas
│   ├── routes/        # Express routes
│   ├── services/      # Business logic
│   └── utils/         # Helper functions

frontend/
├── src/
│   ├── components/    # React components
│   ├── types/         # TypeScript interfaces
│   ├── hooks/         # Custom hooks
│   ├── services/      # API clients
│   └── utils/         # Helper functions
```

## Contributing

1. **Fork** the repository.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**.
