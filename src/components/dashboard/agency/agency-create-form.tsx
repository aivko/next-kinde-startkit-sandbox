'use client';
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { sendEmail } from '@/actions';
import {
  fetchAdmin,
  updateAdmin,
  fetchAgencies,
} from "@/components/dashboard/agency/api";
import {
  validationSchema,
  FormData,
} from "@/components/dashboard/agency/constants";
import { AgencyCard } from '@/components/dashboard/agency/agency-card';
import CircularIndeterminate from '@/components/dashboard/shared/CircularIndeterminate';

const inputStyles = {
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};

export function AgencyCreateForm(): React.JSX.Element {
  const [adminInfo, setAdminInfo] = useState<FormData | {}>({});
  const [isFormEditing, setFormEditing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormEditing = (val:boolean = true) => {
    setFormEditing(val)
  };

  const fetchData = async () => {
    try {
      const res = await fetchAdmin();
      setValue('adminEmail', res.data.adminEmail);
      setValue('vat', res.data.vat);
      setValue('iban', res.data.iban);
      setValue('firstName', res.data.firstName);
      setValue('companyName', res.data.companyName);
      setValue('operationAddress', res.data.operationAddress);
      setValue('operationPostCode', res.data.operationPostCode);
      setValue('operationProvince', res.data.operationProvince);
      setValue('operationCity', res.data.operationCity);
      setValue('officeAddress', res.data.officeAddress);
      setValue('officePostCode', res.data.officePostCode);
      setValue('officeCity', res.data.officeCity);
      setValue('officeProvince', res.data.officeProvince);
      setValue('website', res.data.website);
      setValue('phoneNumber', res.data.phoneNumber);
      setValue('mobileNumber', res.data.mobileNumber);
      setValue('notes', res.data.notes);
      setAdminInfo(res.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: FormData) => {
    if (!adminInfo.isVerified) {
      await sendEmail({ data, type: 'agency' });
    }
    data['isVerified'] = true;
    await updateAdmin({ data: data })
      .then(res => {
        setAdminInfo(res.data)
        handleFormEditing(false);
      });
  }

  return (
    <>
      {
        isLoading && <CircularIndeterminate />
      }
      {
        !isFormEditing && !isLoading && <AgencyCard
          adminInfo={adminInfo}
          handleFormEditing={handleFormEditing}
        />
      }
      {
        isFormEditing && <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader title="Informazioni sull'agenzia" />
            <Divider />
            <CardContent>
              <Box mb={2} sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom mb={1} >
                  Informazioni aziendali
                </Typography>
                <Box mt={2} mb={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.companyName)}
                          id="outlined-error-helper-text"
                          label="Denominazione / ragione sociale *"
                          helperText={errors?.companyName?.message}
                          variant="outlined"
                          {...register('companyName')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.firstName)}
                          id="outlined-error-helper-text"
                          label="Nome cognome responsabile *"
                          helperText={errors?.firstName?.message}
                          variant="outlined"
                          {...register('firstName')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.officeAddress)}
                          id="outlined-error-helper-text"
                          label="Indirizzo Sede Legale *"
                          helperText={errors?.officeAddress?.message}
                          variant="outlined"
                          {...register('officeAddress')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.officePostCode)}
                          id="outlined-error-helper-text"
                          label="CAP *"
                          helperText={errors?.officePostCode?.message}
                          variant="outlined"
                          {...register('officePostCode')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.officeCity)}
                          id="outlined-error-helper-text"
                          label="Città *"
                          helperText={errors?.officeCity?.message}
                          variant="outlined"
                          {...register('officeCity')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.officeProvince)}
                          id="outlined-error-helper-text"
                          label="Provincia *"
                          helperText={errors?.officeProvince?.message}
                          variant="outlined"
                          {...register('officeProvince')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          label="Indirizzo Sede Operative"
                          InputLabelProps={{ shrink: true }}
                          {...register('operationAddress')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth>
                        <TextField
                          label="CAP"
                          InputLabelProps={{ shrink: true }}
                          {...register('operationPostCode')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth>
                        <TextField
                          label="Città"
                          InputLabelProps={{ shrink: true }}
                          {...register('operationCity')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth>
                        <TextField
                          label="Provincia"
                          InputLabelProps={{ shrink: true }}
                          {...register('operationProvince')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.vat)}
                          id="outlined-error-helper-text"
                          label="Partita IVA / C.F. *"
                          helperText={errors?.vat?.message}
                          variant="outlined"
                          {...register('vat')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.iban)}
                          id="outlined-error-helper-text"
                          label="IBAN (per pagamento provvigioni) *"
                          helperText={errors?.iban?.message}
                          variant="outlined"
                          {...register('iban')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Typography variant="h5" gutterBottom mb={1}>
                  Informazioni sui contatti
                </Typography>
                <Box mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <TextField
                          error={Boolean(errors.adminEmail)}
                          id="outlined-error-helper-text"
                          label="Email *"
                          helperText={errors?.adminEmail?.message}
                          variant="outlined"
                          {...register('adminEmail')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth required>
                        <TextField
                          sx={inputStyles}
                          type="number"
                          error={Boolean(errors.mobileNumber)}
                          id="outlined-error-helper-text"
                          label="Cellulare *"
                          helperText={errors?.mobileNumber?.message}
                          variant="outlined"
                          {...register('mobileNumber')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <FormControl fullWidth>
                        <TextField
                          sx={inputStyles}
                          type="number"
                          error={Boolean(errors.phoneNumber)}
                          id="outlined-error-helper-text"
                          label="Tellefono"
                          helperText={errors?.phoneNumber?.message}
                          variant="outlined"
                          {...register('phoneNumber')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField fullWidth
                           label="Sito Web"
                           InputLabelProps={{ shrink: true }}
                           {...register('website')}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Typography variant="h5" gutterBottom mb={1} mt={3}>
                  Note
                </Typography>
                <Box mt={2}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      {...register('notes')}
                    />
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
              <Button
                onClick={() => handleFormEditing(false)}
                size="medium"
                type="submit"
                variant="contained"
              >
                Annulla
              </Button>
              <Button
                size="medium"
                type="submit"
                variant="contained"
              >
                Salva
              </Button>
            </CardActions>
          </Card>
        </form>
      }
    </>
  );
}
