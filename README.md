# AI Agents Platform

A full-stack web application with user authentication using Next.js (React) for the frontend and Node.js (Express) with MongoDB for the backend. The application features a dashboard where users can access three AI-powered agents:

## Features

### YouTube Agent
- Input a YouTube video URL
- Summarize video content
- Q&A functionality for video-related questions
- Uses free AI models for processing

### Research AI Agent
- Enter a research topic
- Generate professional research papers in PDF format
- Fetches data from Wikipedia, Semantic Scholar, and arXiv APIs
- Template-based system with AI-enhanced text generation

### Twitter Agent
- Input topics or keywords
- Generate engaging Twitter posts tailored for specific audiences
- Preview and post directly to Twitter (via Twitter API)

## Tech Stack

### Frontend
- Next.js (React)
- Tailwind CSS
- NextAuth for authentication
- shadcn/ui component library

### Backend
- Node.js (Express)
- MongoDB with Mongoose ORM
- AI Processing using Mistral, BLOOM, or Open-Assistant

### Integrations
- YouTube API
- Twitter API
- Scholarly research APIs

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- API keys for YouTube and Twitter

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-agents-platform.git
cd ai-agents-platform
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-agents-platform

# JWT
JWT_SECRET=your-jwt-secret-key

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# Twitter API
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret
```

4. Start the development server
```bash
# Run frontend and backend concurrently
npm run dev:all

# Or run them separately
npm run dev        # Frontend
npm run server     # Backend
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-agents-platform/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Authentication pages
│   └── ...
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...
├── lib/                  # Utility functions
├── server/               # Express backend
│   ├── index.js          # Server entry point
│   └── ...
├── public/               # Static assets
└── ...
```

## Authentication

The application uses NextAuth.js for authentication with a credentials provider. Users can sign up and log in with email and password.

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Log in a user

### YouTube Agent
- `POST /api/youtube/summarize` - Summarize a YouTube video
- `POST /api/youtube/question` - Ask a question about a video

### Research AI
- `POST /api/research/generate` - Generate a research paper

### Twitter Agent
- `POST /api/twitter/generate` - Generate Twitter posts

### User Activities
- `GET /api/activities` - Get user activities

## License

This project is licensed under the MIT License - see the LICENSE file for details.