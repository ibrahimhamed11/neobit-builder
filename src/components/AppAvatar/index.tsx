/**
 * AppAvatar — User avatar with image support and initials fallback
 *
 * Usage:
 *   <AppAvatar uri={user.photoURL} initials="AH" size={48} />
 *   <AppAvatar initials="JD" size={40} color="#6366F1" />
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppAvatarProps {
  uri?: string | null;
  initials?: string;
  size?: number;
  color?: string;       // background color for initials
  style?: ViewStyle;
}

const AppAvatar: React.FC<AppAvatarProps> = ({
  uri,
  initials = '?',
  size = 48,
  color,
  style,
}) => {
  const { colors, fonts } = useAppTheme();

  const avatarStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color ?? colors.primary,
    },
    style,
  ];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[avatarStyle, styles.image] as any}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={avatarStyle}>
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.36,
            fontFamily: fonts.family.bold,
            color: '#FFFFFF',
          },
        ]}
      >
        {initials.toUpperCase().slice(0, 2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {},
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AppAvatar;
