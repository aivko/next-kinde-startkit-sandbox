import * as React from "react";
import "./../globals.css";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import { SideNav } from "@/components/dashboard/layout/side-nav";
import CookiesBanner from "@/components/dashboard/shared/CookieBanner";
const prisma = new PrismaClient();

async function getAdminById(id: string) {
  try {
    return await prisma.admins.findUnique({
      where: { id: id }
    });
  } catch (error) {
    throw error;
  }
}

export default async function RootLayout({
 children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let admin = null;

  if (user && user?.id) {
    const { id, email = '' } = user;
    admin = await getAdminById(id);
    if (!admin) {
      await prisma.admins.create({
        data: {
          id,
          email,
          isVerified: false,
          isVerifiedBySA: false,
          isTosAccepted: false
        }
      });

      redirect("/dashboard/account");
    }
  }

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav admin={admin} />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav user={user} admin={admin}/>
          <main>
            { children }
            {
              !admin?.isTosAccepted && <CookiesBanner admin={admin} />
            }
          </main>
        </Box>
      </Box>
  </>
  );
}
