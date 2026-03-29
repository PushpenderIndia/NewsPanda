import "./global.css";
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from "react-native-bootsplash";
import WelcomeScreen from './src/screens/WelcomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import HomeScreen from './src/screens/HomeScreen';
import { configureGoogleSignIn } from './src/services/auth';

type Screen = 'welcome' | 'topics' | 'home';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      configureGoogleSignIn();
      await BootSplash.hide({ fade: true });
    };

    init();
  }, []);

  const handleSignInComplete = (user: any) => {
    setUserInfo(user);
    setCurrentScreen('topics');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleSignInComplete} />;
      case 'topics':
        return <TopicsScreen onContinue={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen userInfo={userInfo} />;
      default:
        return <WelcomeScreen onContinue={handleSignInComplete} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

export default App;
