import * as Yup from "yup";
import * as React from "react";

// const italyIBANRegex = /[a-zA-Z0-9]{2}\s?([a-zA-Z]{1})([0-9]{3}\s?)([0-9]{4}\s?){1}([0-9]{3})([a-zA-Z0-9]{1}\s?)([a-zA-Z0-9]{4}\s?){2}([a-zA-Z0-9]{3})\s?/;
const italyIBANRegex = /^IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/;
export const apiUrl = '/api/admin';

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Il nome del proprietario è obbligatorio'),
  officeAddress: Yup.string().required('L\'indirizzo della sede legale è obbligatorio'),
  officePostCode: Yup.string().required('È richiesto il codice postale dell\'ufficio'),
  officeCity: Yup.string().required('La città dell\'ufficio è obbligatoria'),
  officeProvince: Yup.string().required('La provincia dell\'ufficio è obbligatoria'),
  vat: Yup.string().required('E\' richiesta l\'IVA'),
  iban: Yup.string().matches(italyIBANRegex, 'IBAN non valido, esempio "IT60X0542811101000000123456"').required('È richiesto l\'IBAN'),
  companyName: Yup.string().required('Nome azienda/Cognome è obbligatorio'),
  adminEmail: Yup.string().email().required('L\'e-mail è obbligatoria'),
  phoneNumber: Yup.string().when([], ([], schema, values) => {
    const { value } = values;
    return value.length === 0 ? schema : schema.min(10, 'Il numero di telefono ha una lunghezza minima di 10 cifre');
  }),
  mobileNumber: Yup.string().when([], ([], schema, values) => {
    const { value } = values;
    return value.length === 0 ? schema.required('Il numero di cellulare è obbligatorio') : schema.min(10, 'Il numero di cellulare ha una lunghezza minima di 10 cifre');
  }),
});

export interface FormData {
  adminEmail: string;
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
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const filterByStatus = (data:any, status:string) => {
  return data.filter(item => {
    const { electricitySelected, gasSelected, fibreSelected, pod_status, pdr_status, fibra_status } = item;
    if (!(electricitySelected || gasSelected || fibreSelected)) return false;
    switch (status) {
      case "submitted":
        return pod_status === "submitted" && pdr_status === "submitted" && fibra_status === "submitted";
      case "activate":
        return (pod_status === "activate" || !electricitySelected) && (pdr_status === "activate" || !gasSelected) && (fibra_status === "activate" || !fibreSelected);
      case "processing":
        return !(pod_status === "submitted" && pdr_status === "submitted" && fibra_status === "submitted") &&
          !((pod_status === "activate" || !electricitySelected) &&
            (pdr_status === "activate" || !gasSelected) &&
            (fibra_status === "activate" || !fibreSelected));
      default:
        return false;
    }
  });
}

export  const isAbleToEditClientRows = ({ customer, role }) => {
  const { electricitySelected, gasSelected, fibreSelected, pod_status, pdr_status, fibra_status } = customer;
  if (role === 'super_admin') return true;
  if (!(electricitySelected || gasSelected || fibreSelected)) return true;
  return (pod_status === "submitted" && pdr_status === "submitted" && fibra_status === "submitted")
};