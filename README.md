# Pickle.me 🥒

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://pickledotme.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[Live Demo](https://pickledotme.vercel.app/) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

## 📖 Overview

Pickle.me is a modern web application that combines AI-powered advice with cognitive training games. Whether you're seeking guidance or looking to sharpen your mental acuity, Pickle.me offers an engaging platform for personal growth and entertainment.

## ✨ Key Features

### 🤖 AI-Powered Advice System

- **Personalized Guidance**: Get tailored advice for any situation or dilemma
- **Real-time Responses**: Powered by OpenAI's GPT for intelligent, contextual answers
- **Consultation History**: Track and review your past conversations
- **Smart Suggestions**: AI-driven follow-up questions and related topics

### 🎮 Brain Training Games

#### 1. Sequence Pickle

- Simon Says-style memory challenge
- Progressive difficulty scaling
- Dynamic score multipliers
- Visual and audio feedback
- Performance tracking

#### 2. Matching Pickles

- Classic card-matching memory game
- Randomized icon patterns
- Move counter and scoring system
- Multiple difficulty levels
- Time-based challenges

#### 3. Speed Pickle

- Rapid visual recognition challenges
- Increasing speed requirements
- Time bonus mechanics
- Streak multipliers
- Performance analytics

### 👤 User Features

- **Authentication**
  - Secure Google OAuth integration
  - Persistent user sessions
  - Profile management
- **Progress Tracking**
  - Personal high scores
  - Game statistics
  - Performance metrics
  - Achievement system
- **Social Features**
  - Global leaderboards
  - Score sharing
  - Community rankings
  - Friend comparisons

## 🛠️ Technical Architecture

### Tech Stack

- **Frontend Framework**
  - Next.js 13+ (App Router)
  - TypeScript 5.0+
  - React 18+
- **Styling & UI**
  - Tailwind CSS 3.3+
  - shadcn/ui components
  - Lucide Icons
  - Custom animations
- **Backend & Data**
  - Firebase 10+ (Auth, Firestore)
  - OpenAI API
- **State Management**
  - React Hooks
  - Zustand 4+
  - Server Actions
- **Development & Deployment**
  - Vercel Platform
  - GitHub Actions
  - ESLint & Prettier

### Core Dependencies

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "firebase": "^10.7.0",
    "lucide-react": "^0.294.0",
    "next": "14.0.3",
    "next-themes": "^0.2.1",
    "openai": "^4.20.1",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.48.2",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.3",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Firebase project credentials

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/brown2020/pickledotme.git
cd pickledotme
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
   Create a `.env.local` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── actions/          # Server actions & API integrations
├── app/              # Next.js app directory
│   ├── games/        # Game route handlers
│   ├── pickle/       # AI advice components
│   └── profile/      # User profile management
├── components/       # React components
│   ├── games/        # Game-specific components
│   ├── layout/       # Layout components
│   └── shared/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions & Firebase setup
├── store/           # State management
├── types/           # TypeScript definitions
└── constants/       # Configuration constants
```

## 🗺️ Development Roadmap

### Phase 1: Core Features Enhancement

- [ ] Advanced difficulty settings
- [ ] Expanded game variations
- [ ] Enhanced user profiles
- [ ] Performance optimization

### Phase 2: Social Features

- [ ] Multiplayer capabilities
- [ ] Friend system
- [ ] Challenge modes
- [ ] Social sharing

### Phase 3: Analytics & Insights

- [ ] Detailed performance metrics
- [ ] Progress visualization
- [ ] Cognitive assessment tools
- [ ] Personalized recommendations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting
- Write comprehensive tests
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)
- **Issues**: [GitHub Issues](https://github.com/brown2020/pickledotme/issues)
- **Discord**: [Join our community](https://discord.gg/pickledotme)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Firebase](https://firebase.google.com/) - Backend Services
- [OpenAI](https://openai.com/) - AI Integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Icon System
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">
  <p>Built with 🥒 by the Pickle.me Team</p>
  <p>
    <a href="https://pickledotme.vercel.app/">Website</a> •
    <a href="https://github.com/brown2020/pickledotme">GitHub</a> •
    <a href="https://twitter.com/pickledotme">Twitter</a>
  </p>
</div>
