import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0A0A0A', 
            },
            headerTintColor: '#FFFFFF',
            headerTitleAlign: 'center', 
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="movie/[id]" options={{ title: 'Detalhes do Filme' }} />
        </Stack>

        <StatusBar 
          style="light"
          backgroundColor="#0A0A0A"
          translucent={false}
           />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
