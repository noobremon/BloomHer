# BloomHer Backend

## Overview
BloomHer is a web application designed for menstrual and PCOS management. This backend service provides the necessary API endpoints to support the frontend application, allowing users to manage their menstrual cycles, track symptoms, and access resources for PCOS management.

## Features
- User registration and authentication
- Menstrual cycle tracking
- PCOS symptom management
- Data storage using MongoDB
- RESTful API for frontend integration

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- dotenv for environment variable management

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd bloomher-backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables:
   ```
   DATABASE_URL=<your-database-url>
   PORT=<your-port-number>
   ```

### Running the Application
To start the server, run:
```
npm start
```
The server will start on the specified port (default is 3000).

### API Endpoints
- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: Authenticate a user
- **GET /api/menstrual-tracking**: Retrieve menstrual cycle data
- **POST /api/pcos-management**: Submit PCOS-related data

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.