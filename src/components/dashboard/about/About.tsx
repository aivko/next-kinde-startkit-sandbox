"use client";

import React, {useEffect, useState} from 'react';
import PdfViewer from "@/components/dashboard/shared/PdfViewer";
import Typography from "@mui/material/Typography";
import {authenticator, purgeCache} from "@/helpers/imagekit";
import { fetchAdmin } from "@/components/dashboard/agency/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {IKContext, IKUpload} from "imagekitio-react";
import {hiddenInputStyles} from "@/components/dashboard/customer/helpers";
import Snackbar from "@mui/material/Snackbar";
const pdfUrl = `https://ik.imagekit.io/qyamapuh1/pdf/CHI_SIAMO.pdf?${Date.now()}`;

export default function About () {
    const [ role, setRole ] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

    const onErrorIKU = (error) => {
        setLoading(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    const onSuccessIKU = (res: { url: any; }) => {
        setLoading(false);
        purgeCache(res?.url);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        fetchAdmin().then(res => {
            setRole(res?.data?.role)
        });
    }, []);
  return (
    <>
        <div>
          <Typography mb={2} variant="h4">Chi siamo</Typography>
          {
              role === 'super_admin' && (
                  <Box mb={2}>
                      <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                          disabled={loading}
                          onClick={() => setLoading(true)}
                      >
                          Cambia PDF per chi siamo
                          <IKContext
                              publicKey="public_d8gEj3vzveSKzKfCe5tK0cNDHuY="
                              urlEndpoint="https://ik.imagekit.io/qyamapuh1"
                              authenticator={authenticator}
                          >
                              <IKUpload
                                  hidden
                                  fileName="CHI_SIAMO.pdf"
                                  useUniqueFileName={false}
                                  folder={"/pdf"}
                                  onError={onErrorIKU}
                                  onSuccess={onSuccessIKU}
                                  onUploadStart={() => setLoading(true)}
                                  style={hiddenInputStyles}
                                  accept=".pdf"
                              />
                          </IKContext>
                      </Button>
                  </Box>
              )
          }
        </div>

        {/*<PdfViewer pdfUrl={pdfUrl} />*/}

        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            message="La cache per il pdf verrà aggiornata tra 5 e 10 minuti"
        />
    </>
  );
};
