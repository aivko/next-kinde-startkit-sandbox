import React, { FC, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import AgencyTable from '@/components/dashboard/agency/agency-table'
import AgencyTabs from "@/components/dashboard/agency/agency-tabs";
import { fetchAgencies } from "@/components/dashboard/agency/api";

interface AdminInfo {
  email: string;
  vat: string;
  iban: string;
  firstName: string;
  companyName: string;
  operationAddress: string;
  operationPostCode: string;
  operationProvince: string;
  operationCity: string;
  officeAddress: string;
  officePostCode: string;
  officeCity: string;
  officeProvince: string;
  website: string;
  phoneNumber: string;
  mobileNumber: string;
  notes: string;
  isVerified: boolean;
  role: string;
}

interface AccountInfoProps {
  adminInfo: AdminInfo;
  handleFormEditing: () => void;
}

export const AgencyCard: FC<AccountInfoProps> = ({ adminInfo, handleFormEditing }) => {
  const [agencies, setAgencies] = useState< []>([]);

  useEffect(() => {
    if (!adminInfo.isVerified) {
      handleFormEditing()
    }
  }, []);

  useEffect(() => {
    if (adminInfo.role === 'super_admin') {
      fetchAgencies()
        .then(res => setAgencies(res.data));
    }
  }, [adminInfo]);


  return (
    <Grid container spacing={3}>
      <Grid item lg={6} md={8} xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <Stack spacing={1} sx={{ textAlign: 'center' }}>
                <Typography variant="h5">{adminInfo.firstName}</Typography>
                <Typography color="text.secondary" variant="body2">
                  <b>Nome della ditta:</b> {adminInfo.companyName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  <b>Email:</b> {adminInfo.email}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  <b>Numero di telefono:</b> {adminInfo.phoneNumber}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  <b>Ruolo:</b> { adminInfo.role === 'super_admin' ? 'Super Amministratore' : 'Agenzia' }
                </Typography>
                <Chip label={ adminInfo.isVerified ? 'verificato' : 'non verificato' } color={ adminInfo.isVerified ? 'success' : 'primary' } variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              onClick={handleFormEditing}
              fullWidth
              variant="text"
            >
              Modifica agenzia
            </Button>
          </CardActions>
        </Card>
      </Grid>
      { adminInfo.role === 'super_admin' && agencies.length > 0 && <>
        <Grid item lg={12} md={12} xs={12}>
          <Typography mb={2} variant="h5">Lista delle Agenzie</Typography>
          <AgencyTable
            adminInfo={adminInfo}
            agencies={agencies}
          />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <Typography mb={2} variant="h5">Lista dei clienti</Typography>
          <AgencyTabs />
        </Grid>
      </>
      }
    </Grid>
  );
};
