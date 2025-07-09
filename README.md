# Family Fitness Tracker 💪

A fun and engaging family fitness tracking app that helps families stay motivated and achieve their daily exercise goals together!

## Features

- **Family Setup**: Create family challenges with up to 6 members (Dad, Mom, Son, Daughter, Grandpa, Grandma)
- **Exercise Configuration**: Customize exercise types and weights for personalized scoring
- **Real-time Progress**: Live tracking of daily goals with animated progress bars
- **Session Logging**: Easy exercise session recording with immediate updates
- **Achievement Celebrations**: Confetti animations when daily goals are reached
- **Mobile-First Design**: Responsive layout that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions (Node.js)
- **Database**: Firestore
- **AI Service**: Python FastAPI (planned)
- **Animations**: Framer Motion, React Confetti
- **Charts**: Recharts (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kawadia/family-fitness-tracker.git
cd family-fitness-tracker
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Set up Firebase configuration:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Firebase credentials

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Firebase Hosting
4. Copy the Firebase configuration to `.env.local`

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Deployment

Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy
```

## Project Structure

```
family-fitness-tracker/
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility functions
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── package.json
├── firebase/             # Firebase Functions (planned)
├── ai-service/           # Python FastAPI (planned)
└── README.md
```

## Planned Features

- **AI Coach**: Personalized workout recommendations and motivation
- **Performance Analytics**: Weekly insights and trend analysis
- **Smart Celebrations**: Context-aware achievement messages
- **Charts & Visualizations**: Progress tracking over time
- **Push Notifications**: Daily reminders and achievement alerts
- **Data Export**: Download family fitness data as JSON

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.