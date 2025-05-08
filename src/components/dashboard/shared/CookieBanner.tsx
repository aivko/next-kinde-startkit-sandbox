"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { updateAdmin } from "@/components/dashboard/agency/api";

export default function CookiesBanner({ admin }) {
  const [bannerOpen, setBannerOpen] = React.useState(true);

  const handleCloseBanner = () => {
    setBannerOpen(false);
  };

  const handleAcceptCookies = async () => {
    try {
      delete admin.id;
      const data = {
        ...admin,
        isTosAccepted: true
      }

      await updateAdmin({ data: data });
    } finally {
      setBannerOpen(false);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={bannerOpen}>
          <Paper
            role="dialog"
            aria-modal="false"
            aria-label="Cookie banner"
            square
            variant="outlined"
            tabIndex={-1}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              m: 0,
              p: 2,
              borderWidth: 0,
              borderTopWidth: 1,
              zIndex: 100000,
            }}
          >
            <Stack
              direction={{ xs: 'column' }}
              justifyContent="space-between"
              gap={2}
              maxWidth='80%'
              margin='auto'
            >
              <Box sx={{ flexShrink: 1, alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                <Typography fontWeight="bold">Questo sito web utilizza i cookie</Typography>
                <Typography variant="body2">
                  Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per scopi tecnici e, con il tuo consenso, per altri scopi come specificato nella
                  <Link
                    href="https://www.iubenda.com/privacy-policy/81126598/cookie-policy"
                    target="_blank"
                    onClick={() => {
                      (function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document)
                    }}
                  >
                    &nbsp;Politica sui cookie&nbsp;
                  </Link>
                  e nella
                  <Link
                    href="https://www.iubenda.com/privacy-policy/81126598"
                    target="_blank"
                    onClick={() => {
                      (function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document)
                    }}
                  >
                    &nbsp;Politica sulla privacy&nbsp;
                  </Link>.
                  Utilizza il pulsante "Accetta" per acconsentire. Utilizza il pulsante "Rifiuta" o chiudi questa informativa per continuare senza accettare.
                </Typography>
              </Box>
              <Stack
                gap={2}
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ flexShrink: 0, alignSelf: { sm: 'center' } }}
              >
                <Button
                  size="medium"
                  onClick={handleAcceptCookies}
                  variant="contained"
                  sx={{
                    minWidth: '200px'
                  }}
                >
                  Accetta
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  onClick={handleCloseBanner}
                  sx={{
                    minWidth: '200px'
                  }}
                >
                  Rifiuta
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </TrapFocus>
    </React.Fragment>
  );
}