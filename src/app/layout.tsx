import type { Metadata } from "next";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import { UserProvider } from '@/context/userContext';

export const metadata: Metadata = {
  title: "Virtual Game Shelf",
  description: "Patrick Punch, Oregon State University",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <CssBaseline />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}