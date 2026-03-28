import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { signInWithGoogle } from '../services/auth';
import { GoogleLogo } from '../components/GoogleLogo';
import DuoButton from '../components/DuoButton';

interface WelcomeScreenProps {
  onContinue: (userInfo: any) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const userInfo = await signInWithGoogle();
      onContinue(userInfo);
    } catch (error: any) {
      console.error('Sign In Failed:', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-blue-50">
      {/* Decorative circles for visual interest */}
      <View className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full opacity-20 -mr-32 -mt-32" />
      <View className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full opacity-20 -ml-40 -mb-40" />

      <View className="flex-1 px-6 justify-center items-center">
        {/* Mascot */}
        <View className="mb-8 items-center">
          <View className="bg-white/80 rounded-full p-8 shadow-lg">
            <Image
              source={require('../assets/panda-mascot.png')}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Headline */}
        <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
          Meet your personal{'\n'}news buddy
        </Text>

        {/* Subtext */}
        <Text className="text-lg text-gray-600 text-center mb-12 px-4">
          Smart, funny, and tailored just for you
        </Text>

        {/* Continue Button */}
        <View className="w-full max-w-sm mb-4">
          <DuoButton
            title="Sign in with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            isLoading={isLoading}
            icon={<GoogleLogo size={20} />}
            fullWidth
          />
        </View>

        {/* Bottom text */}
        <Text className="text-sm text-gray-500 text-center mt-4">
          We personalize your news experience
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
