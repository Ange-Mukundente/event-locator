# Event Locator API

## Project Overview
This is a multi-user event locator application built with Node.js and MongoDB. It allows users to discover events based on location and preferences, with features like user authentication, event management, location-based search, category filtering, multilingual support, and notifications.

## Features
- **User Authentication**: Secure user registration and login with password hashing.
- **Event Management**: CRUD operations for events, including geolocation (latitude/longitude).
- **Location-Based Search**: Find events within a specified radius using MongoDB's geospatial queries.
- **Category Filtering**: Users can filter events based on categories.
- **Multilingual Support**: Users can select their preferred language (i18n implementation).
- **Notification System**: Message queue (e.g., Redis Pub/Sub, RabbitMQ) to send event reminders.
- **Unit Testing**: Jest or Mocha for testing core functionalities.

## Technologies Used
- **Node.js & Express.js**
- **MongoDB with Mongoose** (using geospatial indexing for event locations)
- **Redis Pub/Sub or RabbitMQ** for notifications
- **i18next** for internationalization
- **bcrypt & JWT** for authentication
- **Jest/Mocha** for unit testing

## Database Schema (MongoDB)
```json
{
  "User": {
    "username": "string",
    "email": "string",
    "password": "string",
    "location": { "type": "Point", "coordinates": [longitude, latitude] },
    "preferences": ["category1", "category2"]
  },
  "Event": {
    "title": "string",
    "description": "string",
    "location": { "type": "Point", "coordinates": [longitude, latitude] },
    "date": "ISODate",
    "category": "string",
    "createdBy": "ObjectId"
  }
}
```

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/event-locator.git
   cd event-locator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure:
   ```
   MONGO_URI=mongodb://localhost:27017/eventlocator
   JWT_SECRET=your_secret_key
   REDIS_URL=redis://localhost:6379
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
### User Routes
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login and receive a token
- `GET /api/users/me` - Get user profile

### Event Routes
- `POST /api/events` - Create an event
- `GET /api/events` - Get all events (supports location-based search and filtering)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

## Challenges & Solutions
- **Geospatial Queries in MongoDB**: Used `2dsphere` index to enable radius-based searches.
- **Real-time Notifications**: Implemented Redis Pub/Sub for sending event reminders.
- **Internationalization**: Used `i18next` to support multiple languages dynamically.

## Video Presentation
[Link to video presentation](#) 

---
### Author: [Ange-Mukundente]
