
# SoftSwap Backend

This is a Flask backend with SQLite database for the SoftSwap application.

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the server:
```
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user and get JWT token
- POST /api/auth/forgot-password - Request password reset

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get a single product
- POST /api/products - Create a new product (authenticated)
- PUT /api/products/:id - Update a product (authenticated)
- DELETE /api/products/:id - Delete a product (authenticated)

## Database

The application uses SQLite with two main tables:
- Users - For user account data
- Products - For software product data

The database file is created automatically as `softswap.db` when the application runs.

## Security

- Passwords are hashed using Werkzeug's password hashing
- Authentication is handled with JWT tokens
- Protected routes require a valid token
