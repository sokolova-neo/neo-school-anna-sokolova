'use client';

import '@/styles/global.css';

import CssBaseline from '@mui/material/CssBaseline';
import { styled, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { LightTheme } from '@neofinancial/morpheus-theme-light';

import { EmotionRegistry } from '@/styles/emotion-registry';
import { ApolloClientProvider } from '../context/apollo-client.context';
import { RemoteFeatureFlagProvider } from '../context/remote-flag.context';

interface RootLayoutProps {
  children: React.ReactNode;
}

const BodyContainer = styled('body')(({ theme }) => ({
  backgroundColor: theme.palette.backgroundDefault.main,
  margin: theme.spacingToken.spaceNone,
}));

const MainContainer = styled('main')(() => ({
  width: '100vw',
  minHeight: '100%',
}));

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <EmotionRegistry options={{ key: 'mui' }}>
        <ThemeProvider theme={LightTheme}>
          <CssBaseline />
          <BodyContainer>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <ApolloClientProvider>
                <RemoteFeatureFlagProvider>
                  <MainContainer>{children}</MainContainer>
                </RemoteFeatureFlagProvider>
              </ApolloClientProvider>
            </SnackbarProvider>
          </BodyContainer>
        </ThemeProvider>
      </EmotionRegistry>
    </html>
  );
}
