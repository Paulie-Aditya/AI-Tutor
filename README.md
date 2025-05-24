# AI Multi-Agent Tutor System

A sophisticated educational platform powered by Google's Gemini AI, featuring specialized agents for Math and Physics tutoring with integrated computational tools.

## 🚀 Live Demo

- **Frontend**: [https://multi-ai-tutor.vercel.app/](https://multi-ai-tutor.vercel.app/)
- **Backend API**: [Render Deployment](https://your-backend-url.onrender.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Agent System](#agent-system)
- [Tools](#tools)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

This multi-agent tutoring system leverages Google's Gemini AI to provide personalized educational assistance across Math and Physics domains. The system intelligently delegates user queries to specialized agents equipped with domain-specific tools and knowledge bases.

### Key Capabilities

- **Intelligent Query Routing**: Automatically determines the most appropriate agent for each question
- **Specialized Domain Expertise**: Dedicated Math and Physics agents with tailored responses
- **Computational Tools**: Built-in calculator and physics constants database
- **Real-time Interaction**: Smooth, responsive chat interface with typing indicators
- **Modern UI/UX**: Dark mode, animations, and mobile-responsive design

## 🏗 Architecture

The system follows a clean multi-agent architecture with clear separation of concerns:

```
                    ┌─────────────────────────────────────┐
                    │            USER INTERFACE           │
                    │         (Next.js Frontend)          │
                    │                                     │
                    │  ┌─────────────────────────────┐    │
                    │  │      Chat Interface         │    │
                    │  │   • Message Input/Output    │    │
                    │  │   • Agent Response Display  │    │
                    │  │   • Real-time Updates       │    │
                    │  └─────────────────────────────┘    │
                    └─────────────────┬───────────────────┘
                                      │ HTTP/REST API
                                      ▼
                    ┌─────────────────────────────────────┐
                    │         FLASK API GATEWAY           │
                    │                                     │
                    │  ┌─────────────────────────────┐    │
                    │  │       Tutor Agent           │    │
                    │  │    (Request Router)         │    │
                    │  │                             │    │
                    │  │  • Query Analysis           │    │
                    │  │  • Agent Selection Logic    │    │
                    │  │  • Response Coordination    │    │
                    │  └─────────────┬───────────────┘    │
                    │                │                    │
                    │       ┌────────┴────────┐           │
                    │       ▼                 ▼           │
                    │  ┌──────────┐      ┌──────────┐     │
                    │  │   MATH   │      │ PHYSICS  │     │
                    │  │  AGENT   │      │  AGENT   │     │
                    │  │          │      │          │     │
                    │  │ • Algebra│      │ • Mechanics    │
                    │  │ • Calculus│     │ • Thermodynamics│
                    │  │ • Geometry│     │ • Electromagnetism│
                    │  └────┬─────┘      └─────┬────┘     │
                    │       │                  │          │
                    │       └────────┬─────────┘          │
                    │                ▼                    │
                    │  ┌─────────────────────────────┐    │
                    │  │         TOOL LAYER          │    │
                    │  │                             │    │
                    │  │  ┌─────────┐ ┌─────────────┐│    │
                    │  │  │Calculator│ │Physics      ││    │
                    │  │  │Tool     │ │Constants    ││    │
                    │  │  │         │ │Database     ││    │
                    │  │  └─────────┘ └─────────────┘│    │
                    │  └─────────────────────────────┘    │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │          GEMINI AI SERVICE          │
                    │                                     │
                    │    • Natural Language Processing    │
                    │    • Mathematical Reasoning         │
                    │    • Physics Knowledge Base         │
                    │    • Contextual Understanding       │
                    └─────────────────────────────────────┘
```

### Component Interactions:

1. **User Query Flow**: User inputs question → Frontend sends to Flask API
2. **Agent Routing**: Tutor Agent analyzes query and selects appropriate specialist agent
3. **Tool Integration**: Specialist agents utilize computational tools when needed
4. **AI Processing**: Agents leverage Gemini AI for intelligent responses
5. **Response Delivery**: Formatted response sent back through the chain to user

## ✨ Features

### Frontend Features

- **Interactive Chat Interface**: Real-time messaging with message history
- **Agent Identification**: Visual badges showing which agent responded
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Eye-friendly interface with theme persistence
- **Typing Indicators**: Visual feedback during AI processing
- **Smooth Animations**: Framer Motion powered transitions
- **Copy to Clipboard**: Easy sharing of responses
- **Error Handling**: Graceful error display and recovery

### Backend Features

- **Multi-Agent Architecture**: Specialized agents for different domains
- **Intelligent Routing**: Context-aware query delegation
- **Tool Integration**: Seamless access to computational tools
- **Error Recovery**: Robust error handling and fallback mechanisms
- **CORS Support**: Secure cross-origin resource sharing
- **Environment Management**: Secure API key handling

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

### Backend

- **Framework**: Flask (Python)
- **AI Integration**: Google Generative AI (Gemini)
- **CORS**: Flask-CORS
- **Environment**: python-dotenv
- **Error Handling**: Custom middleware

### Deployment

- **Frontend**: Vercel (Global CDN)
- **Backend**: Render (Containerized deployment)
- **Environment**: Secure environment variable management

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- Google AI API key ([Get it here](https://ai.google.dev))

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Paulie-Aditya/ai-tutor-multi-agent.git
   cd ai-tutor-multi-agent/backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**

   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```

5. **Run the backend**
   ```bash
   python app.py
   ```
   Backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Add NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Frontend will start on `http://localhost:3000`

## 📖 Usage

### Basic Usage

1. **Open the application** at `http://localhost:3000`
2. **Type your question** in the chat input
3. **Send your message** - the system will automatically route it to the appropriate agent
4. **View the response** with agent identification badges

### Example Queries

**Math Questions:**

- "Solve the quadratic equation x² + 5x + 6 = 0"
- "Calculate the integral of sin(x) from 0 to π"
- "What is the derivative of e^(2x)?"

**Physics Questions:**

- "Explain Newton's second law of motion"
- "What is the speed of light in vacuum?"
- "Calculate the kinetic energy of a 2kg object moving at 10 m/s"

**Calculation Requests:**

- "Calculate 15 \* 23 + 47"
- "What is the square root of 144?"
- "Evaluate (5 + 3) \* 2 - 4"

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://ai-tutor-multi-agent.onrender.com`

### Endpoints

#### `POST /api/chat`

Send a message to the tutor system.

**Request Body:**

```json
{
  "messages": [{ "role": "user", "content": "What is the derivative of x²?" }]
}
```

**Response:**

```json
{
  "response": "The derivative of x² is 2x.",
  "agent": "MathAgent",
  "reason": "The user is asking for the derivative of x² which falls under mathematics."
}
```

#### `GET /api/health`

Check API health status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### `GET /api/agents`

Get information about available agents.

**Response:**

```json
{
  "agents": [
    {
      "name": "math",
      "description": "Specialized in mathematical problems and calculations",
      "tools": ["calculator"]
    },
    {
      "name": "physics",
      "description": "Expert in physics concepts and calculations",
      "tools": ["physics_constants", "calculator"]
    }
  ]
}
```

## 🤖 Agent System

### Base Agent Architecture

All agents inherit from the `BaseAgent` class, providing:

- Consistent API interface
- Error handling mechanisms
- Response formatting
- Tool integration capabilities

### Math Agent

- **Specialization**: Algebra, calculus, geometry, statistics
- **Tools**: Calculator, equation solver
- **Capabilities**:
  - Solve equations and inequalities
  - Perform complex calculations
  - Explain mathematical concepts
  - Step-by-step problem solving

### Physics Agent

- **Specialization**: Mechanics, thermodynamics, electromagnetism, optics
- **Tools**: Physics constants database, calculator
- **Capabilities**:
  - Explain physical phenomena
  - Perform physics calculations
  - Provide relevant constants and formulas
  - Solve physics problems

### Tutor Agent (Main Router)

- **Function**: Intelligent query routing and orchestration
- **Logic**: Keyword analysis and context understanding
- **Fallback**: Direct Gemini consultation for ambiguous queries

## 🛠 Tools

### Calculator Tool

- **Purpose**: Perform mathematical calculations safely
- **Features**:
  - Basic arithmetic operations
  - Trigonometric functions
  - Logarithmic functions
  - Expression evaluation with safety checks

### Physics Constants Tool

- **Purpose**: Provide accurate physical constants
- **Database**: 20+ fundamental constants including:
  - Speed of light (c)
  - Planck's constant (h)
  - Gravitational constant (G)
  - Electron mass and charge
  - And more...

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**

   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   - `NEXT_PUBLIC_API_URL`: Your backend URL

### Backend Deployment (Render)

1. **Connect to Render**

   - Connect your GitHub repository
   - Add environment variables: `GEMINI_API_KEY`
   - Deploy automatically on push

2. **Environment Variables**
   - `GEMINI_API_KEY`: Your Google AI API key
   - `PORT`: Automatically set by Render

### Environment Variables Summary

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**Backend (.env):**

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔧 Development

### Project Structure

```
ai-tutor-multi-agent/
├── backend/
│   ├── agents/
│   │   ├── base_agent.py      # Base agent class
│   │   ├── math_agent.py      # Math-specialized agent
│   │   ├── physics_agent.py   # Physics-specialized agent
│   │   └── tutor_agent.py     # Main routing agent
│   ├── tools/
│   │   ├── calculator.py      # Mathematical calculator
│   │   └── physics_constants.py # Physics constants database
│   ├── app.py                 # Flask application
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Chat/             # Chat-related components
│   │   └── Layout/           # Layout components
│   ├── pages/
│   │   ├── api/              # API routes (if needed)
│   │   └── index.tsx         # Main page
│   ├── styles/               # Global styles
│   ├── utils/                # Utility functions
│   └── types/                # TypeScript type definitions
└── README.md
```

### Available Scripts

**Backend:**

```bash
# Run development server
python app.py

# Install dependencies
pip install -r requirements.txt
```

**Frontend:**

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and structure
- Add comprehensive comments for complex logic
- Test all agent interactions thoroughly
- Ensure responsive design for new UI components
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for providing the Gemini API
- **Vercel** for frontend hosting
- **Render** for backend deployment
- **shadcn/ui** for beautiful UI components
- **Next.js** and **Flask** communities for excellent documentation

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Paulie-Aditya/ai-tutor-multi-agent/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Built with ❤️ using modern web technologies and AI**
