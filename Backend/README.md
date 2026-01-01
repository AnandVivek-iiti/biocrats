# Backend Setup Instructions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB

  # macOS (with Homebrew)
  brew services start mongodb-community

  # Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string and update in `.env` file

### 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your configurations
# Important: Change JWT_SECRET to a strong random string!
```

### 3. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at `Backend_Url`

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Signup
```
POST /api/signup
Content-Type: application/json
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "year": 2024,
  "program": "B.Tech",
  "jobRole": "Software Engineer"
}
```
Response (Success):
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "year": 2024,
    "program": "B.Tech",
    "jobRole": "Software Engineer"
  }
}
```

### 3. Login
```
POST /api/login
Content-Type: application/json
```
Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 4. Get Profile (Protected)
```
GET /api/profile
Authorization: Bearer <jwt_token>
```

## Project Structure

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables (create this)
├── .env.example       # Environment template
└── README.md          # This file
```

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` in `.env` to a strong random string
2. Set `NODE_ENV=production`
3. Use HTTPS
4. Implement rate limiting
5. Add input sanitization
6. Use MongoDB Atlas with IP whitelisting
7. Never commit `.env` file to version control

## Testing the API

### Using cURL:

```bash
# Test signup
curl -X POST Backend_Url/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "year": 2024,
    "program": "B.Tech",
    "jobRole": "Software Engineer"
  }'
```

### Using Postman:
1. Import the endpoints
2. Set method to POST
3. Set URL to `Backend_Url/api/signup`
4. Set body to JSON and add the required fields
5. Send request

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, check IP whitelist

### Port Already in Use
- Change PORT in `.env`
- Or kill the process using port 5000

### CORS Error
- Backend CORS is enabled for all origins
- For production, restrict origins in `server.js`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/signup_db |
| JWT_SECRET | Secret for JWT signing | (must be set) |
| NODE_ENV | Environment | development |

## Next Steps

1. Add email verification
2. Implement password reset
3. Add refresh tokens
4. Implement rate limiting
5. Add logging (Winston/Morgan)
6. Add validation library (Joi/Yup)
7. Add API documentation (Swagger)

## License

ISC