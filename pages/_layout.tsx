import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && !router.pathname.startsWith('/auth/')) {
      router.push('/auth/signin');
    }
  }, [status, router]);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {children}
    </Box>
  );
} 