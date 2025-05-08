"use client";
import * as React from 'react';

import './globals.css';
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
// import { UserProvider } from '@/contexts/user-context';
// import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
//import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import { UserProvider } from '@/contexts/user-context';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <KindeProvider>
      <html lang="en">
        <body>
        <>
          {/*<UserProvider>*/}
            <ThemeProvider>{children}</ThemeProvider>
          {/*</UserProvider>*/}
        </>
        </body>
      </html>
    </KindeProvider>
  );
}
