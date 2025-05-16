import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

//
// CONFIGURABLE: Set header height as a % of screen height
//
const HEADER_HEIGHT_PERCENT = 0.25;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_PERCENT;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  stickyHeader?: ReactElement;
  respectStatusBar?: boolean;
  respectNavigationBar?: boolean;
  autoScrollToBottom?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  stickyHeader,
  respectStatusBar = true,
  respectNavigationBar = true,
  autoScrollToBottom = false,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomTabOverflow();

  const topPadding = respectStatusBar ? insets.top : 0;
  const bottomPadding = respectNavigationBar ? bottomInset : 0;

  // Animate header scaling and translation
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1]
        ),
      },
    ],
  }));

  // Animate sticky header opacity
  const stickyHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [0, 1]
    ),
  }));

  // Auto-scroll to bottom on mount
  useEffect(() => {
    if (autoScrollToBottom && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 50); // slight delay ensures layout is ready
    }
  }, [autoScrollToBottom]);

  return (
    <ThemedView style={styles.container}>
      {stickyHeader && (
        <Animated.View
          style={[
            styles.stickyHeader,
            { top: topPadding },
            stickyHeaderStyle,
          ]}
        >
          {stickyHeader}
        </Animated.View>
      )}

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom: bottomPadding }}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
        }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>

        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  stickyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
