'use client';

import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from "@mui/icons-material/Visibility";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';

import { fetchAllCustomer, fetchCustomer, removeCustomer } from "@/components/dashboard/customer/api";
import { ClientForm } from "@/components/dashboard/shared/ClientForm";
import { useCustomerContext } from "@/components/dashboard/customer/customers-layout";
import CircularIndeterminate from '@/components/dashboard/shared/CircularIndeterminate';
import { fetchAdmin } from "@/components/dashboard/agency/api";
import { setStatusLabel, setStatusIconsColors } from "@/app/dashboard/helpers";
import { Transition } from "@/components/dashboard/customer/helpers";
import { isAbleToEditClientRows } from "@/components/dashboard/agency/constants";

export function CustomersTable({ agencyData }) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [agencyId, setAgencyId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [agencyClient, setAgencyClient] = useState<object>({});
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const {
    isModalOpenContext,
    setModalOpenContext,
    setCustomerContext,
    setCustomersContext,
    customerContext,
    customersContext,
  } = useCustomerContext();

  useEffect(() => {
    fetchAdmin().then(res => {
      const { id, role } = res.data;
      setRole(role)
      setAgencyId(id);
      fetchAllCustomer({ id })
        .then(res => {
          // show last added customers first
          const customersList = res.data || [];
          setCustomersContext(customersList.reverse());
        })
        .catch(() => {
          setLoading(false);
        }).finally(() => {
          setLoading(false);
      });
    })

  }, []);

  const handleEdit = async (id: string) => {
    const customer = await fetchCustomer({
      customerId: id,
      agencyId
    });
    setCustomerContext(customer.data);
    setModalOpenContext(true);
  };

  const handleCustomers = async (value) => {
    setCustomersContext(value)
  };

  const handleModal = async (value:boolean) => {
    setModalOpenContext(value);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (client:object) => {
    setDialogOpen(true);
    setAgencyClient(client)
  };

  const handleDeleteClient = async () => {
    try {
      await removeCustomer(agencyClient);
      const updatedCustomers = customersContext.filter(customer => customer.id !== agencyClient.id);
      setCustomersContext(updatedCustomers);
    } catch (error) {
      console.error("Error occurred while deleting customer:", error);
    } finally {
      setAgencyClient({});
      setDialogOpen(false);
    }
  };

  return (
    <Card>
      {
        isLoading && <CircularIndeterminate />
      }
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cellulare</TableCell>
              <TableCell>Stato Luce</TableCell>
              <TableCell>Stato Gas</TableCell>
              <TableCell>Stato Fibra</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersContext.map((row) =>
              <TableRow hover key={row.id} >
                <TableCell>
                  <Typography variant="subtitle2">{row.firstName}, {row.companyName}</Typography>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>
                  {
                    row?.pod_status && row?.pod && <Chip
                      size="small"
                      sx={{
                        minWidth: '100px',
                        backgroundColor: setStatusIconsColors(row?.pod_status),
                        color: 'white'
                      }}
                      label={setStatusLabel(row?.pod_status)}
                    />
                  }

                </TableCell>
                <TableCell>
                  {
                    row?.pdr_status && row?.pdr && <Chip
                      size="small"
                      sx={{
                        minWidth: '100px',
                        backgroundColor: setStatusIconsColors(row?.pdr_status),
                        color: 'white'
                      }}
                      label={setStatusLabel(row?.pdr_status)}
                    />
                  }
                </TableCell>
                <TableCell>
                  {
                    row?.fibra_status && row?.fibreSelected && <Chip
                      size="small"
                      sx={{
                        minWidth: '100px',
                        backgroundColor: setStatusIconsColors(row?.fibra_status),
                        color: 'white'
                      }}
                      label={setStatusLabel(row?.fibra_status)}
                    />
                  }
                </TableCell>
                <TableCell>

                  {
                    isAbleToEditClientRows({
                      customer: row,
                      role
                    }) ?
                      <>
                        <IconButton
                          onClick={() => handleEdit(row.id)}
                          aria-label="edit"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(row)}
                          aria-label="delte"
                          size="small"
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </>
                      : <>
                        <IconButton
                          onClick={() => handleEdit(row.id)}
                          aria-label="delte"
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </>
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle id="alert-dialog-title">
          Sei sicuro di cancellare?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Questa finestra di dialogo modale ti chiede di confermare la tua decisione di eliminare un cliente dall'agenzia. Facendo clic su "Cancellare", procederai con il processo di eliminazione.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            variant="contained"
            size="medium"
            onClick={handleDeleteClient}
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
      {
        isModalOpenContext && <ClientForm
          role={role}
          customer={customerContext}
          customers={customersContext}
          isModalOpen={isModalOpenContext}
          setCustomers={handleCustomers}
          setModalOpen={handleModal}
          agencyData={agencyData}
        />
      }
    </Card>
  );
}
