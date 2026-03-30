import "./global.css";
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from "react-native-bootsplash";
import WelcomeScreen from './src/screens/WelcomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import MainScreen from './src/screens/MainScreen';
import { configureGoogleSignIn } from './src/services/auth';
import { getUserInfo, isOnboardingCompleted } from './src/services/storage';

type Screen = 'welcome' | 'topics' | 'home';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      configureGoogleSignIn();

      // Check if user has already completed onboarding
      const onboardingDone = await isOnboardingCompleted();
      const savedUserInfo = await getUserInfo();

      if (onboardingDone && savedUserInfo) {
        setUserInfo(savedUserInfo);
        setCurrentScreen('home');
      }

      setIsLoading(false);
      await BootSplash.hide({ fade: true });
    };

    init();
  }, []);

  const handleSignInComplete = async (user: any) => {
    setUserInfo(user);
    setCurrentScreen('topics');
  };

  const handleTopicsComplete = async () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    // Don't render anything while loading
    if (isLoading) {
      return null;
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleSignInComplete} />;
      case 'topics':
        return <TopicsScreen onContinue={handleTopicsComplete} userInfo={userInfo} />;
      case 'home':
        return <MainScreen userInfo={userInfo} />;
      default:
        return <WelcomeScreen onContinue={handleSignInComplete} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {renderScreen()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
