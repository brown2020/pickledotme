# Pickle.me 🥒

[Live Demo](https://pickledotme.vercel.app/)

Pickle.me is a fun and engaging web application that combines AI-powered advice with brain training games. When you're in a pickle or just want to keep your mind sharp, Pickle.me has you covered!

## Features

### 🤖 AI Advice

- Get personalized advice for any dilemma
- Real-time AI-generated responses using OpenAI's GPT
- Save and track your consultation history

### 🎮 Memory Games

1. **Sequence Pickle**

   - Simon Says-style memory game
   - Increasing difficulty levels
   - Score multipliers based on sequence length

2. **Matching Pickles**

   - Classic memory matching game
   - Randomly selected icons
   - Score based on moves taken

3. **Speed Pickle**
   - Fast-paced visual recognition game
   - Progressive difficulty
   - Time bonuses for correct picks

### 📊 User Features

- Google authentication
- Personal high scores
- Global leaderboards
- Profile statistics

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **AI**: OpenAI API
- **State Management**: React Hooks, Zustand
- **UI Components**: shadcn/ui, Lucide Icons
- **Deployment**: Vercel

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- An OpenAI API key
- A Firebase project set up with Google Authentication enabled
- npm or yarn package manager

## Running Locally

1. Clone the repository

```bash
git clone https://github.com/brown2020/pickledotme.git
cd pickledotme
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your credentials:

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

## Project Structure

```
src/
├── actions/          # Server actions (AI integration)
├── app/              # Next.js 13+ app directory
│   ├── games/        # Game routes
│   ├── pickle/       # AI advice route
│   └── profile/      # User profile route
├── components/       # React components
│   ├── games/        # Game components
│   ├── layout/       # Layout components
│   └── shared/       # Shared components
├── lib/             # Firebase and utility functions
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── store/           # State management
└── constants/       # Game configurations
```

## Roadmap 🗺️

Our vision is to evolve Pickle.me into a comprehensive brain training platform. Here's what's coming:

### Upcoming Game Categories 🎯

1. **Memory Games**

   - ✅ Sequence Memory (Simon Says)
   - ✅ Visual Memory (Card Matching)
   - ✅ Speed Memory (Quick Recognition)
   - 🚧 Pattern Memory
   - 🚧 Number Memory
   - 🚧 Word Memory

2. **Logic Games**

   - 🚧 Pattern Completion
   - 🚧 Sudoku Variants
   - 🚧 Logic Puzzles
   - 🚧 Mathematical Sequences

3. **Focus Games**

   - 🚧 Attention Training
   - 🚧 Concentration Tests
   - 🚧 Distraction Challenges
   - 🚧 Multi-tasking Exercises

4. **Problem Solving**
   - ✅ AI-Assisted Problem Solving
   - 🚧 Strategy Puzzles
   - 🚧 Critical Thinking Challenges
   - 🚧 Decision-Making Scenarios

### User Experience Improvements 🌟

1. **Progress Tracking**

   - 🚧 Detailed Performance Analytics
   - 🚧 Progress Visualization
   - 🚧 Skill Category Breakdown
   - 🚧 Personal Improvement Trends

2. **Training Programs**

   - 🚧 Customized Training Paths
   - 🚧 Daily Workout Routines
   - 🚧 Difficulty Progression System
   - 🚧 Targeted Skill Development

3. **Social Features**

   - 🚧 Friend Challenges
   - 🚧 Group Competitions
   - 🚧 Achievement Sharing
   - 🚧 Community Rankings

4. **Gamification**
   - 🚧 Achievement System
   - 🚧 Daily Challenges
   - 🚧 Skill Badges
   - 🚧 Experience Points

### Scientific Integration 🧠

1. **Cognitive Assessment**

   - 🚧 Baseline Skill Measurement
   - 🚧 Progress Assessment
   - 🚧 Cognitive Domain Mapping
   - 🚧 Performance Insights

2. **Research-Based Features**
   - 🚧 Scientific Skill Tracking
   - 🚧 Evidence-Based Exercises
   - 🚧 Cognitive Research Integration
   - 🚧 Expert-Designed Challenges

Legend:

- ✅ Implemented
- 🚧 Planned
- 💭 Under Consideration

## Development

### Firebase Setup

1. Create a new Firebase project
2. Enable Google Authentication
3. Create a Firestore database
4. Add your web app to get configuration credentials
5. Enable necessary Firebase services (Auth, Firestore)

### OpenAI Setup

1. Create an account at OpenAI
2. Generate an API key
3. Add the key to your environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Email: [info@ignitechannel.com](mailto:info@ignitechannel.com)

Project Link: [https://github.com/brown2020/pickledotme](https://github.com/brown2020/pickledotme)

Live Demo: [https://pickledotme.vercel.app/](https://pickledotme.vercel.app/)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Firebase](https://firebase.google.com/) - Backend and Authentication
- [OpenAI](https://openai.com/) - AI Integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Deployment Platform

---

Built with 🥒 by [Pickle.me](https://pickledotme.vercel.app/)
