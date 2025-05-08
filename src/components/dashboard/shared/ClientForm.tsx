"use client";

import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import { FormData, Transition, validationSchema, mergeObjects, hiddenInputStyles, errorText } from "@/components/dashboard/customer/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCustomer, removeCustomer, updateCustomer } from "@/components/dashboard/customer/api";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

import DeleteIcon from "@mui/icons-material/Delete";
import ImageKit from "imagekit";
import { IKContext, IKUpload } from "imagekitio-react";
import { setStatusIconsColors } from "@/app/dashboard/helpers";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { isAbleToEditClientRows } from "@/components/dashboard/agency/constants";
import { sendEmail } from "@/actions";

const inputStyles = {
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};

export function ClientForm({ customer= {}, isModalOpen = false, customers = [], setCustomers, setModalOpen, role = '', agencyData = {} }) {
  const [addedFiles, setAddedFiles] = useState<Array<any>>([]);
  const [addedFilesError, setAddedFilesError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [podStatus, setPodStatus] = useState<string>('submitted');
  const [pdrStatus, setPdrStatus] = useState<string>('submitted');
  const [fibraStatus, setFibraStatus] = useState<string>('submitted');
  const [isLoadingButton, setLoadingButton] = React.useState<boolean | false>(false);
  const [imageId, setImageId] = useState<string>('');
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const authenticator =  async () => {
    try {
      const imagekit = new ImageKit({
        publicKey: "public_d8gEj3vzveSKzKfCe5tK0cNDHuY=",
        privateKey : "private_AFF1Lt9av2DRYNrKJxKnx309WMw=",
        urlEndpoint: "https://ik.imagekit.io/qyamapuh1",
      });

      const getCredentials = () => {
        return new Promise((resolve,reject)=>{
          resolve(imagekit.getAuthenticationParameters())
        })
      };

      const data = await getCredentials();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (customer.id) {
      setValue('companyName', customer.companyName);
      setValue('electricitySelected', customer.electricitySelected);
      setValue('email', customer.email);
      setValue('fibreSelected',  customer.fibreSelected);
      setValue('firstName', customer.firstName);
      setValue('gasSelected', customer.gasSelected);
      setValue('iban', customer.iban);
      setValue('mobileNumber', customer.mobileNumber);
      setValue('notes', customer.notes);
      setValue('officeAddress', customer.officeAddress);
      setValue('officeCity', customer.officeCity);
      setValue('officePostCode', customer.officePostCode);
      setValue('officeProvince', customer.officeProvince);
      setValue('operationAddress', customer.operationAddress);
      setValue('operationCity', customer.operationCity);
      setValue('operationPostCode', customer.operationPostCode);
      setValue('operationProvince', customer.operationProvince);
      setValue('phoneNumber', customer.phoneNumber);
      setValue('vat', customer.vat);
      setValue('pdr', customer.pdr);
      setValue('pod', customer.pod);
      setValue('pod_transfer', customer.pod_transfer);
      setValue('pdr_transfer', customer.pdr_transfer);
      setValue('fibra_transfer', customer.fibra_transfer);
      setValue('postalBulletin', customer.postalBulletin);
      setValue('fiberMobileNumber', customer.fiberMobileNumber);
      setPodStatus(customer.pod_status);
      setPdrStatus(customer.pdr_status);
      setFibraStatus(customer.fibra_status);
      setAddedFiles(customer.files);
    }
  }, [customer]);

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "all"
  });
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleChangeSelectPOD = (event: SelectChangeEvent) => {
    setPodStatus(event.target.value);
  };

  const handleChangeSelectPDR = (event: SelectChangeEvent) => {
    setPdrStatus(event.target.value);
  };

  const handleChangeFibraPDR = (event: SelectChangeEvent) => {
    setFibraStatus(event.target.value);
  };

  const onError = (error) => {
    console.log(error)
    if (addedFiles?.length < 1) {
      setAddedFilesError(true);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (addedFiles?.length < 1) {
      setAddedFilesError(true);
      return false;
    } else {
      setLoadingButton(true);
      data['files'] = addedFiles;
      data['pod_status'] = podStatus;
      data['pdr_status'] = pdrStatus;
      data['fibra_status'] = fibraStatus;

      if (customer?.id) {
        const result = mergeObjects(customer, data);
        updateCustomer(result).then(res => {
          const updatedCustomers = customers.filter(customer => customer.id !== res.data.id);
          setCustomers([res.data, ...updatedCustomers]);
          setLoadingButton(false);
          handleClose();
        })
      } else {
        createCustomer(data).then(res => {
          setCustomers([res.data, ...customers]);
          setLoadingButton(false);
          handleClose();
          sendEmail({ data, type: 'client', agency: agencyData });
        })
      }
    }
  }

  const onErrorIKU = (err) => {
    setLoading(false);
  };

  const onSuccessIKU = (res) => {
    setLoading(false);
    setAddedFilesError(false);
    const { fileId, name } = res;
    setAddedFiles([
      ...addedFiles,
      {
        name,
        id: fileId
      }
    ])
  };

  const handleClick = async ({ id, name }) => {
    const url = `https://ik.imagekit.io/qyamapuh1/${name}`
    window.open(url)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = () => {
    const updatedFiles = addedFiles.filter(file => file.id !== imageId);
    setAddedFiles(updatedFiles);
    setImageId('')
    handleDialogClose();
  };

  const handleDeleteImage = async ({ id }) => {
    setImageId(id)
    setDialogOpen(true);
  };

  return (
    <Dialog
      fullScreen
      open={isModalOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Informazioni Dettagliate sul cliente
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            <CloseIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <CardContent>
            <Box mb={2} sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom mb={1} >
                Cliente
              </Typography>
              <Box mt={2} mb={4}>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.companyName)}
                        id="outlined-error-helper-text"
                        label="Ragione sociale / Cognome *"
                        variant="outlined"
                        helperText={errors?.companyName?.message}
                        {...register('companyName')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.firstName)}
                        id="outlined-error-helper-text"
                        label="Nome titolare *"
                        helperText={errors?.firstName?.message}
                        variant="outlined"
                        {...register('firstName')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.vat)}
                        id="outlined-error-helper-text"
                        label="Partita IVA/ C.F. *"
                        helperText={errors?.vat?.message}
                        variant="outlined"
                        {...register('vat')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                      <TextField
                        error={Boolean(errors.iban)}
                        id="outlined-error-helper-text"
                        label="IBAN (Accredito bollette)"
                        helperText={errors?.iban?.message}
                        variant="outlined"
                        {...register('iban')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.officeAddress)}
                        id="outlined-error-helper-text"
                        label="Indirizzo residenza*"
                        helperText={errors?.officeAddress?.message}
                        variant="outlined"
                        {...register('officeAddress')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.officePostCode)}
                        id="outlined-error-helper-text"
                        label="CAP*"
                        helperText={errors?.officePostCode?.message}
                        variant="outlined"
                        {...register('officePostCode')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.officeCity)}
                        id="outlined-error-helper-text"
                        label="Città*"
                        helperText={errors?.officeCity?.message}
                        variant="outlined"
                        {...register('officeCity')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.officeProvince)}
                        id="outlined-error-helper-text"
                        label="Provincia*"
                        helperText={errors?.officeProvince?.message}
                        variant="outlined"
                        {...register('officeProvince')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.operationAddress)}
                        helperText={errors?.operationAddress?.message}
                        label="Indirizzo fornitura (completo di civico) *"
                        InputLabelProps={{ shrink: true }}
                        {...register('operationAddress')}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.operationPostCode)}
                        helperText={errors?.operationPostCode?.message}
                        label="CAP *"
                        InputLabelProps={{ shrink: true }}
                        {...register('operationPostCode')}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.operationCity)}
                        helperText={errors?.operationCity?.message}
                        label="Città *"
                        InputLabelProps={{ shrink: true }}
                        {...register('operationCity')}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.operationProvince)}
                        helperText={errors?.operationProvince?.message}
                        label="Provincia *"
                        InputLabelProps={{ shrink: true }}
                        {...register('operationProvince')}
                        size="small"
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
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth required>
                      <TextField
                        error={Boolean(errors.email)}
                        id="outlined-error-helper-text"
                        label="Email*"
                        helperText={errors?.email?.message}
                        variant="outlined"
                        {...register('email')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
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
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                      <TextField
                        sx={inputStyles}
                        type="number"
                        id="outlined-error-helper-text"
                        label="Telefono"
                        variant="outlined"
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors?.phoneNumber?.message}
                        {...register('phoneNumber')}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel
                      labelPlacement="end"
                      label="Bollettino postale"
                      control={<Controller
                        control={control}
                        name="postalBulletin"
                        defaultValue={false}
                        {...register('postalBulletin')}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Checkbox
                            id="postalBulletin"
                            onChange={onChange}
                            onBlur={onBlur}
                            checked={!!value}
                          />
                        )}
                      />}
                    />
                    { errors?.postalBulletin?.message && <FormHelperText style={errorText}>{errors?.postalBulletin?.message}</FormHelperText>}

                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h5" gutterBottom mb={1}>
                      Cliente Servizi
                    </Typography>
                    <Box
                      mb={2}
                      pt={1}
                      pb={1}
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: '1px solid grey',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems:'center'
                      }}
                    >
                      <Grid
                        container
                        spacing={3}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems:'center',
                        }}
                      >
                        <Grid item>
                          <FormControlLabel
                            labelPlacement="bottom"
                            label="Luce"
                            control={<Controller
                              control={control}
                              name="electricitySelected"
                              defaultValue={false}
                              {...register('electricitySelected')}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Checkbox
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  checked={!!value}
                                />
                              )}
                            />}
                          />
                        </Grid>

                        <Grid item xs={4} md={4}>
                          <FormControl fullWidth required>
                            <TextField
                              sx={inputStyles}
                              error={Boolean(errors.pod)}
                              helperText={errors?.pod?.message}
                              label="POD *"
                              InputLabelProps={{ shrink: true }}
                              {...register('pod')}
                              size="small"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <RadioGroup
                            row
                            name="pod-radio-buttons-group"
                            defaultValue={customer?.pod_transfer || "pod_voltura"}
                          >
                            <FormControlLabel
                              value="pod_voltura"
                              label="Voltura"
                              {...register('pod_transfer')}
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value="pod_nuova"
                              label="Nuova attivazione"
                              {...register('pod_transfer')}
                              control={<Radio />}
                            />
                          </RadioGroup>
                        </Grid>

                        <Grid item>
                          <FormControl
                            sx={{ m: 1, minWidth: 180 }}
                            size="small"
                            disabled={role !== 'super_admin'}
                          >
                            <InputLabel id="demo-select-small-label">Stato del contratto</InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="light-select"
                              label="Stato del contratto"
                              value={podStatus || 'submitted'}
                              onChange={handleChangeSelectPOD}
                            >
                              <MenuItem selected={true} value="submitted">Inviato</MenuItem>
                              <MenuItem value="progress">In lavorazione</MenuItem>
                              <MenuItem value="accepted">Accettata</MenuItem>
                              <MenuItem value="rejected">Rifiutata</MenuItem>
                              <MenuItem value="activate">Attiva</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Avatar sx={{ backgroundColor: setStatusIconsColors(podStatus) }} variant="rounded">
                            <AssignmentIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      mb={2}
                      pt={1}
                      pb={1}
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: '1px solid grey'
                      }}
                    >

                      <Grid
                        container
                        spacing={3}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems:'center'
                        }}
                      >
                        <Grid item>
                          <FormControlLabel
                            labelPlacement="bottom"
                            label="Gas"
                            control={<Controller
                              control={control}
                              name="gasSelected"
                              defaultValue={false}
                              {...register('gasSelected')}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Checkbox
                                  id="gasSelected"
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  checked={!!value}
                                />
                              )}
                            />}
                          />
                        </Grid>

                        <Grid item xs={4} md={4}>
                          <FormControl fullWidth required>
                            <TextField
                              sx={inputStyles}
                              type="number"
                              error={Boolean(errors.pdr)}
                              helperText={errors?.pdr?.message}
                              label="PDR *"
                              InputLabelProps={{ shrink: true }}
                              {...register('pdr')}
                              size="small"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <RadioGroup
                            row
                            name="pdr-radio-buttons-group"
                            defaultValue={customer?.pdr_transfer || "pdr_voltura"}
                          >
                            <FormControlLabel
                              value="pdr_voltura"
                              label="Voltura"
                              {...register('pdr_transfer')}
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value="pdr_nuova"
                              label="Nuova attivazione"
                              {...register('pdr_transfer')}
                              control={<Radio />}
                            />
                          </RadioGroup>
                        </Grid>

                        <Grid item>
                          <FormControl
                            sx={{ m: 1, minWidth: 180 }}
                            size="small"
                            disabled={role !== 'super_admin'}
                          >
                            <InputLabel
                              id="demo-select-small-label">
                              Stato del contratto
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              label="Stato del contratto"
                              id="gas-select"
                              value={pdrStatus || 'submitted'}
                              onChange={handleChangeSelectPDR}
                            >
                              <MenuItem selected={true} value="submitted">Inviato</MenuItem>
                              <MenuItem value="progress">In lavorazione</MenuItem>
                              <MenuItem value="accepted">Accettata</MenuItem>
                              <MenuItem value="rejected">Rifiutata</MenuItem>
                              <MenuItem value="activate">Attiva</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Avatar sx={{ backgroundColor: setStatusIconsColors(pdrStatus) }} variant="rounded">
                            <AssignmentIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      pt={1}
                      pb={1}
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: '1px solid grey'
                      }}
                    >
                      <Grid
                        container
                        spacing={3}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems:'center'
                        }}
                      >
                        <Grid item>
                          <FormControlLabel
                            labelPlacement="bottom"
                            label="Fibra"
                            control={<Controller
                              control={control}
                              name="fibreSelected"
                              defaultValue={false}
                              {...register('fibreSelected')}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Checkbox
                                  id="fibreSelected"
                                  onBlur={onBlur}
                                  checked={!!value}
                                  onChange={onChange}
                                />
                              )}
                            />}
                          />
                        </Grid>

                        <Grid item xs={4} md={4}>
                          <FormControl fullWidth required>
                            <TextField
                              sx={inputStyles}
                              type="number"
                              error={Boolean(errors.fiberMobileNumber)}
                              id="outlined-error-helper-text"
                              label="Cellulare *"
                              helperText={errors?.fiberMobileNumber?.message}
                              variant="outlined"
                              {...register('fiberMobileNumber')}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <RadioGroup
                            row
                            name="pdr-radio-buttons-group"
                            defaultValue={customer?.fibra_transfer || "fibra_mnp"}
                          >
                            <FormControlLabel
                              value="fibra_mnp"
                              label="MNP"
                              sx={{
                                minWidth: '94px'
                              }}
                              {...register('fibra_transfer')}
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value="fibra_nuova"
                              label="Nuovo numero"
                              sx={{
                                minWidth: '171px'
                              }}
                              {...register('fibra_transfer')}
                              control={<Radio />}
                            />
                          </RadioGroup>
                        </Grid>

                        <Grid item>
                          <FormControl
                            sx={{ m: 1, minWidth: 180 }}
                            size="small"
                            disabled={role !== 'super_admin'}
                          >
                            <InputLabel
                              id="demo-select-small-label">
                              Stato del contratto
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              label="Stato del contratto"
                              id="fibra-select"
                              value={fibraStatus || 'submitted'}
                              onChange={handleChangeFibraPDR}
                            >
                              <MenuItem selected={true} value="submitted">Inviato</MenuItem>
                              <MenuItem value="progress">In lavorazione</MenuItem>
                              <MenuItem value="accepted">Accettata</MenuItem>
                              <MenuItem value="rejected">Rifiutata</MenuItem>
                              <MenuItem value="activate">Attiva</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Avatar sx={{ backgroundColor: setStatusIconsColors(fibraStatus) }} variant="rounded">
                            <AssignmentIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Box>
                    {errors?.electricitySelected &&  <Typography variant="body2" gutterBottom style={errorText}>{ errors.electricitySelected.message }</Typography>}
                  </Grid>
                  <Grid item sx={{ position: 'relative' }}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      disabled={ loading || addedFiles?.length >= 6 }
                      startIcon={<CloudUploadIcon />}
                      onClick={() => setAddedFilesError(false)}
                    >
                      Caricare file
                      <IKContext
                        publicKey="public_d8gEj3vzveSKzKfCe5tK0cNDHuY="
                        urlEndpoint="https://ik.imagekit.io/qyamapuh1"
                        authenticator={authenticator}
                      >
                        <IKUpload
                          hidden
                          onError={onErrorIKU}
                          onSuccess={onSuccessIKU}
                          onUploadStart={() => setLoading(true)}
                          style={hiddenInputStyles}
                          accept=".jpg, .jpeg, .png, .doc, .docx, .pdf,"
                        />
                      </IKContext>
                    </Button>

                    {addedFilesError &&  <Typography variant="body2" gutterBottom style={errorText}>
                      Documento riconoscimento <br/>
                      Bolletta luce / gas <br/>
                      Codice fiscale / Tessera sanitaria
                    </Typography>}
                    {loading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: '#635bff',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    {
                      addedFiles?.length > 0 && addedFiles.map(file => <Chip
                        sx={{
                          marginRight: 1
                        }}
                        key={file.id}
                        label={file.name}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleClick(file)}
                        onDelete={() => handleDeleteImage(file)}
                        deleteIcon={<DeleteIcon />}
                      />)
                    }
                  </Grid>
                </Grid>
              </Box>
              <Typography variant="h5" gutterBottom mb={1} mt={3}>
                Note
              </Typography>
              <Box mt={2}>
                <FormControl fullWidth>
                  <TextField
                    multiline
                    rows={4}
                    size="small"
                    {...register('notes')}
                  />
                </FormControl>
              </Box>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button
              onClick={handleClose}
              size="medium"
              type="button"
              variant="contained"
            >
              Annulla
            </Button>
            <LoadingButton
              disabled={!isAbleToEditClientRows({
                customer,
                role
              })}
              loading={isLoadingButton}
              size="medium"
              type="submit"
              variant="contained"
            >
              Invia
            </LoadingButton>
          </CardActions>
        </Card>
        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionComponent={Transition}
          keepMounted
        >
          <DialogTitle id="alert-dialog-title">
            Sei sicuro di cancellare il file?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Questa finestra di dialogo modale ti chiede di confermare la tua decisione di eliminare un'immagine. Facendo clic su "Cancellare", procederai con il processo di eliminazione.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              variant="contained"
              size="medium"
              onClick={handleDelete}
              autoFocus
              sx={{
                minWidth: '100px'
              }}
            >
              Cancellare</Button>
            <Button
              color="info"
              variant="contained"
              size="medium"
              onClick={handleDialogClose}
              sx={{
                minWidth: '100px'
              }}
            >
              Annulla
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Dialog>
  );
};
