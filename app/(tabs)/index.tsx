import { useEffect, useRef } from 'react';
import { Image, StyleSheet, Platform, Animated, ViewStyle, ImageStyle } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Step {
  title: string;
  content: JSX.Element;
}

interface HeaderBackgroundColor {
  light: string;
  dark: string;
}

interface AnimationRefs {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  logoScaleAnim: Animated.Value;
}

export default function HomeScreen(): JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const runAnimations = (): void => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
      ]).start();
    };

    runAnimations();
  }, [fadeAnim, slideAnim, logoScaleAnim]);

  const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

  const getPlatformShortcut = (): string => {
    return Platform.select({
      ios: 'cmd + d',
      android: 'cmd + m',
      web: 'F12',
    }) || '';
  };

  const steps: Step[] = [
    {
      title: 'Try it',
      content: (
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">{getPlatformShortcut()}</ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      ),
    },
    {
      title: 'Explore',
      content: (
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      ),
    },
    {
      title: 'Get a fresh start',
      content: (
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      ),
    },
  ];

  const headerBackgroundColor: HeaderBackgroundColor = {
    light: '#A1CEDC',
    dark: '#1D3D47',
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={headerBackgroundColor}
      headerImage={
        <Animated.Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={[
            styles.reactLogo as Animated.WithAnimatedValue<ImageStyle>,
            {
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        />
      }>
      <AnimatedThemedView
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </AnimatedThemedView>

      {steps.map((step, index) => (
        <AnimatedThemedView
          key={index}
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50 + index * 20],
                  }),
                },
              ],
            },
          ]}>
          <ThemedText type="subtitle">Step {index + 1}: {step.title}</ThemedText>
          {step.content}
        </AnimatedThemedView>
      ))}
    </ParallaxScrollView>
  );
}

interface Styles {
  titleContainer: ViewStyle;
  stepContainer: ViewStyle;
  reactLogo: ImageStyle;  // Changed from ViewStyle to ImageStyle
}

const styles = StyleSheet.create<Styles>({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});