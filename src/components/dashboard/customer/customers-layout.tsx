"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { fetchAdmin } from "@/components/dashboard/agency/api";
import { useRouter } from "next/navigation";

interface Customer {
  vat:string,
  iban:string,
  email:string,
  notes:string,
  firstName:string,
  companyName:string,
  mobileNumber:string,
  electricitySelected:boolean,
  gasSelected:boolean,
  fibreSelected:boolean,
  officeAddress:string,
  officeCity:string,
  officePostCode:string,
  officeProvince:string,
  operationAddress:string,
  operationCity:string,
  operationPostCode:string,
  operationProvince:string,
  phoneNumber:string,
  postalBulletin: boolean,
}

interface ClientContextType {
  customersContext: Array<object>;
  setCustomersContext: (customersContext: any) => void;
  customerContext: Customer | {};
  setCustomerContext: (customerContext: any) => void;
  isModalOpenContext: boolean;
  setModalOpenContext: (isOpen: boolean) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useCustomerContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a ClientProvider');
  }
  return context;
}

export function CustomersLayout(): React.ReactElement {
  const [customersContext, setCustomersContext] = useState<Array<any>>([]);
  const [customerContext, setCustomerContext] = useState<Customer | undefined>(undefined);
  const [isModalOpenContext, setModalOpenContext] = useState<boolean>(false);
  const [agencyData, setAgencyData] = useState<Object>({});
  const router = useRouter()

  const contextValue: ClientContextType = {
    customersContext,
    setCustomersContext,
    customerContext,
    setCustomerContext,
    isModalOpenContext,
    setModalOpenContext
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetchAdmin();
      setAgencyData(res.data);
      if (!res.data.isVerified) {
        router.push("/dashboard/account");
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  return (
    <ClientContext.Provider value={contextValue}>
      <>
        <CustomersFilters agencyData={agencyData} />
        <CustomersTable agencyData={agencyData} />
      </>
    </ClientContext.Provider>
  );
}
