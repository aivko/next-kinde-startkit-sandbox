"use client";

import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useCustomerContext } from "@/components/dashboard/customer/customers-layout";
import AddIcon from '@mui/icons-material/Add';
import { ClientForm } from "@/components/dashboard/shared/ClientForm";


export function CustomersFilters({ agencyData }) {
  const {
    setModalOpenContext,
    setCustomerContext,
    isModalOpenContext} = useCustomerContext();

  const handleClick = () => {
    setCustomerContext({})
    setModalOpenContext(true);
  };

  const handleCustomers = async (value) => {
    // console.log(value)
  };

  const handleModal = async (value:boolean) => {
    setModalOpenContext(value);
  };

  return (
    <React.Fragment>
      <Card sx={{ p: 2, justifyContent: 'flex-end', display: 'flex' }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleClick}
          variant="contained"
          size="medium">
          Aggiungi cliente
        </Button>
      </Card>
      {
        isModalOpenContext && <ClientForm
          customer={{  }}
          customers={[]}
          isModalOpen={isModalOpenContext}
          setCustomers={handleCustomers}
          setModalOpen={handleModal}
          agencyData={agencyData}
        />
      }
    </React.Fragment>
  );
}
