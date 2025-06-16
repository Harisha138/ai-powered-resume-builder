# AI Resume Builder Backend

A powerful Node.js backend API for an AI-powered resume builder application built with Express, MongoDB, and OpenAI integration.

## Features

- 🔐 **Authentication & Authorization**
  - Email/password registration and login
  - Google OAuth integration
  - JWT session management
  - Email verification
  - Password reset functionality

- 🤖 **AI Integration**
  - OpenAI GPT-4 integration for content generation
  - Professional summary generation
  - Job description improvement
  - Skills suggestions
  - Resume analysis and optimization

- 📄 **Resume Management**
  - CRUD operations for resumes
  - Multiple resume templates
  - PDF export functionality
  - Public resume sharing
  - Resume analytics

- 👤 **User Management**
  - User profiles and settings
  - Subscription management
  - AI credits tracking
  - Dashboard statistics

- 🔒 **Security**
  - Rate limiting
  - Input validation
  - Security headers
  - Password hashing
  - Session management

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   - Copy `.env` file and update with your credentials
   - Make sure MongoDB, Google OAuth, and OpenAI API keys are configured

3. **Start the server:**
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

4. **Health check:**
   Visit: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get single resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Features
- `POST /api/ai/generate-summary` - Generate professional summary
- `POST /api/ai/improve-description` - Improve job description
- `POST /api/ai/suggest-skills` - Suggest relevant skills
- `GET /api/ai/usage` - Get AI usage statistics

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/dashboard-stats` - Get dashboard statistics

## Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String,
  password: String,
  googleId: String,
  picture: String,
  isEmailVerified: Boolean,
  subscription: String, // 'free', 'premium', 'enterprise'
  aiCreditsUsed: Number,
  aiCreditsLimit: Number
}
\`\`\`

### Resume Model
\`\`\`javascript
{
  user: ObjectId,
  title: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    summary: String
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: {
    technical: [String],
    soft: [String]
  },
  template: String,
  status: String, // 'draft', 'completed', 'archived'
  isPublic: Boolean,
  publicUrl: String
}
\`\`\`

## Environment Variables

All required environment variables are included in the `.env` file.

## Deployment

This backend is ready to deploy to:
- Heroku
- Railway
- Vercel
- DigitalOcean
- AWS

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Authentication)
- OpenAI API
- bcryptjs (Password hashing)
- Express Validator
- Helmet (Security)

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ai-resume-builder-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/resume-builder
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SESSION_SECRET=your-session-secret
   \`\`\`

4. **Start MongoDB**
   \`\`\`bash
   # Using MongoDB locally
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   \`\`\`

5. **Seed the database (optional)**
   \`\`\`bash
   npm run seed
   \`\`\`

6. **Start the server**
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Session secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `CLIENT_URL` | Frontend URL | Yes |
| `FROM_EMAIL` | Email sender address | No |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### OpenAI Setup

1. Sign up at [OpenAI](https://openai.com/)
2. Generate an API key
3. Add the key to your environment variables

## Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## Security Considerations

- All passwords are hashed using bcrypt
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Session-based authentication
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@resumebuilder.com or create an issue in the repository.
