export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notificationsEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetOTP: { email: string };
  NewPassword: { email: string; resetToken: string };
  VerifyEmail: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};
