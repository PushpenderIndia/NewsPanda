# NewsPanda - AI-Powered News Recommender

NewsPanda is a gamified news reading mobile application built with React Native that delivers personalized news content with an engaging, 

## Features

### AI News Recommender
- Personalized news recommendations based on user-selected topics
- Real-time news aggregation from Google News RSS feeds
- Smart topic mapping for relevant content delivery
- Swipeable card interface for easy news consumption

### Gamification System
- **XP (Experience Points)**: Earn 1 XP for every news article you swipe
- **Daily Streak**: Build and maintain your reading streak by using the app daily
- **Leaderboard**: Compete with other users and climb the ranks based on your streak
- Hall of Fame podium display for top 3 users (Gold, Silver, Bronze)

### Daily Top 5 News Podcast
- Topic-wise audio news summaries
- 35-second podcast episodes for quick news updates
- Beautiful podcast player with play/pause controls and progress slider
- Lottie animations for enhanced user experience

### Multi-Lingual Support (Coming Soon)
- Support for multiple languages
- Localized news content

### Additional Features
- Google Sign-In authentication
- Topic customization (Tech, Startups, Finance, Politics, Sports, AI, Crypto, World News, Entertainment)
- Beautiful UI with Duolingo-inspired design
- Persistent data storage with AsyncStorage
- Backend synchronization with MongoDB

## Tech Stack

- **Frontend**: React Native 0.84.1 with TypeScript
- **Backend**: Flask + MongoDB
- **LLM**: Gemini 3.1 Flash
- **Voice Model**: ElevenLabs
- **Authentication**: Google Sign-In OAuth
- **UI Components**:
  - react-native-vector-icons for icons
  - react-native-linear-gradient for visual effects
  - Lottie for animations
  - react-native-sound for audio playback
- **State Management**: React Hooks
- **Storage**: AsyncStorage for local persistence

## Build APP

```
npx expo prebuild --platform android --clean
cd android
  ./gradlew clean
  ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
  cp app/build/outputs/apk/release/app-release.apk ../NewsPanda-release.apk
```

### For Google Play Release

```
npx expo prebuild --platform android --clean
cd android
./gradlew clean
./gradlew bundleRelease
cp app/build/outputs/bundle/release/app-release.aab ../NewsPanda-release.aab
```
