import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MQTTProvider } from '../contexts/MQTTContext';
import theme from '../styles/theme';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <MQTTProvider>
            <Component {...pageProps} />
          </MQTTProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp; 