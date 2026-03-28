import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/googleSignIn';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
};

export const signInWithGoogle = async (): Promise<UserInfo> => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();

  return {
    id: userInfo.data?.user.id || '',
    email: userInfo.data?.user.email || '',
    name: userInfo.data?.user.name || '',
    photo: userInfo.data?.user.photo || undefined,
  };
};

export const signOut = async () => {
  await GoogleSignin.signOut();
};

export const getCurrentUser = async () => {
  const user = await GoogleSignin.getCurrentUser();
  if (!user) return null;

  return {
    id: user.data.user.id,
    email: user.data.user.email,
    name: user.data.user.name,
    photo: user.data.user.photo || undefined,
  };
};
