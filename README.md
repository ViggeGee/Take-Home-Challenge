# Model Monitor MVP

A full-stack web application for monitoring brand mentions in AI-generated responses. Built with React, Node.js, and PostgreSQL.

## Features

- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **Brand Management**: Add, edit, and delete brands with custom prompts
- **AI Response Simulation**: Generate mock AI responses using Faker.js
- **Rating System**: Rate responses with 👍/👎 feedback
- **User Isolation**: Each user only sees their own brands and responses
- **Responsive UI**: Clean, modern interface with smooth interactions

## Tech Stack

- **Frontend**: React 18, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js, JWT, bcrypt, dotenv
- **Database**: PostgreSQL with proper relational design
- **Other**: Faker.js for mock data generation

## Database Schema

```sql
users (id, email, password, created_at)
brands (id, user_id, name, prompt, created_at)
responses (id, brand_id, response_text, created_at)  
ratings (id, response_id, rating, created_at)
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/ViggeGee/Take-Home-Challenge.git
cd model-monitor
```

### 2. Setup Database
1. Install PostgreSQL and create a database named `model_monitor`
2. Update database credentials in `backend/config/database.js`
3. Initialize the database:
```bash
cd backend
npm install
node config/init-db.js
```

### 3. Setup Backend
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your PostgreSQL password and JWT secret

npm run dev
```
Server will run on http://localhost:5000

### 4. Setup Frontend
```bash
cd frontend  
npm install
npm start
```
Frontend will run on http://localhost:3000

## Demo Accounts

- **User 1**: `user1@example.com` / `password123`
- **Admin**: `admin@example.com` / `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/verify` - Verify JWT token

### Brands
- `GET /api/brands` - Get user's brands
- `POST /api/brands` - Create new brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Responses
- `GET /api/responses/brand/:brandId` - Get responses for brand
- `POST /api/responses/generate/:brandId` - Generate fake AI response
- `POST /api/responses/:responseId/rate` - Rate response (👍/👎)

## Project Structure

```
model-monitor/
├── backend/
│   ├── config/
│   │   ├── database.js      # Database connection
│   │   └── init-db.js       # Database initialization
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── brands.js        # Brand CRUD routes
│   │   └── responses.js     # Response & rating routes
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js     # Login form
│   │   │   ├── Dashboard.js # Brand management
│   │   │   └── BrandDetail.js # Response viewing & rating
│   │   ├── App.js           # Main app with routing
│   │   └── App.css          # Styling
│   └── package.json
└── README.md
```

## Design Decisions

### Security
- **JWT Authentication**: Stateless, scalable authentication
- **bcrypt Password Hashing**: Industry-standard password security
- **Protected Routes**: Both API endpoints and frontend routes are protected
- **User Data Isolation**: SQL queries ensure users only access their own data

### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages
- **Modal Forms**: Clean, focused editing experience

### Database Design
- **Normalized Schema**: Proper relationships between entities
- **Cascading Deletes**: Clean up orphaned records automatically
- **Indexed Foreign Keys**: Optimized query performance

## Future Enhancements

### Implemented Bonus Features
- ✅ bcrypt password hashing
- ✅ Protected API endpoints and routes

### Potential Additions
- TypeScript for better type safety
- Stats dashboard (% positive responses per brand)
- Search and filtering functionality
- Real LLM API integration (OpenAI/Claude)
- React Query for better state management
- Email notifications for brand mentions
- Bulk operations for brands/responses

## Development Notes

This project was built as a take-home challenge to demonstrate full-stack development skills. The focus was on:

1. **Clean Architecture**: Separation of concerns between frontend/backend
2. **Security Best Practices**: Proper authentication and authorization
3. **Database Design**: Efficient relational schema
4. **User Experience**: Intuitive, responsive interface
5. **Code Quality**: Readable, maintainable code structure

The AI response generation uses Faker.js for simplicity, but the architecture supports easy integration with real LLM APIs.

## License

This project is for demonstration purposes.