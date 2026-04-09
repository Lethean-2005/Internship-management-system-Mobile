import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconSchool } from '@tabler/icons-react-native';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splash}>
      <IconSchool size={120} color="#ffffff" strokeWidth={1.2} />
      <Text style={styles.title}>IMS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
    marginTop: 4,
  },
});
