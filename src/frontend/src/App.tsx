import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LockedScreen from './components/LockedScreen';
import DiaryScreen from './features/diary/DiaryScreen';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender']}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Initializing...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show locked screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender']}>
        <LockedScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender']}>
        <ProfileSetup />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show loading while profile is being fetched
  if (profileLoading || !isFetched) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender']}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your diary...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show diary screen if authenticated and profile exists
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem themes={['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender']}>
      <DiaryScreen userProfile={userProfile ?? null} />
      <Toaster />
    </ThemeProvider>
  );
}
