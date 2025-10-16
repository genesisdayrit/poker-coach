# 🎴 Poker Coach

An intelligent Texas Hold'em poker coaching application that provides real-time hand analysis, win probability calculations, GTO recommendations, and threat detection.

## ✨ Features

- **Hand Strength Analysis**: Evaluates your current hand with visual strength indicators
- **Win Probability Calculator**: Monte Carlo simulation for accurate equity calculations
- **GTO Recommendations**: Position-based pre-flop strategy
- **Draw Detection**: Identifies outs and calculates equity for drawing hands
- **Threat Analysis**: Detects possible beating hands and dangerous cards to watch
- **Multi-Player Support**: Accurate equity calculations for 2-9 players
- **AI-Powered Advice**: Get strategic insights powered by OpenAI

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Then navigate to `http://localhost:3000` and start playing!

## 📚 Documentation

Detailed implementation documentation is available in the [`docs/`](./docs) folder:

- [Multi-Player Implementation](./docs/MULTI_PLAYER_IMPLEMENTATION.md)
- [Win Probability Setup](./docs/WIN_PROBABILITY_SETUP.md)
- [Threat Detection System](./docs/THREAT_DETECTION_IMPLEMENTATION.md)

## 🎯 How to Use

1. **Draw Hand**: Get your two hole cards
2. **Select Position**: Choose your position at the table
3. **Draw Flop/Turn/River**: Progress through the hand
4. **Review Analysis**: See hand strength, win probability, and threats
5. **Get AI Advice**: Click for strategic recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Hand Evaluation**: pokersolver library
- **Equity Calculation**: poker-odds-calc library
- **AI Integration**: OpenAI API

## 📊 What It Analyzes

### Pre-Flop
- GTO opening ranges by position
- Hand strength categories (premium, strong, playable)
- Recommended actions (raise, call, fold)

### Post-Flop
- Current hand strength (pair, two pair, flush, etc.)
- Win probability vs N opponents
- Drawing outs and equity
- Possible beating hands on the board
- Dangerous turn/river cards to watch

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new features
- Improve existing analysis
- Enhance the UI/UX
- Fix bugs

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

Built as a learning project to explore poker strategy analysis and real-time coaching.