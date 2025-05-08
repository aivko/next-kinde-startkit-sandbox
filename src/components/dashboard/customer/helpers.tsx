import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import * as Yup from "yup";

export const mergeObjects = (mainObj, obj) => {
  return { ...mainObj, ...obj };
};

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// const italyIBANRegex = /[a-zA-Z0-9]{2}\s?([a-zA-Z]{1})([0-9]{3}\s?)([0-9]{4}\s?){1}([0-9]{3})([a-zA-Z0-9]{1}\s?)([a-zA-Z0-9]{4}\s?){2}([a-zA-Z0-9]{3})\s?/;
const italyIBANRegex = /^IT[0-9]{2}[A-Z0-9]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/;

export interface FormData {
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
  phoneNumber: string;
  mobileNumber: string;
  notes: string;
  electricitySelected: boolean;
  gasSelected: boolean;
  fibreSelected: boolean;
  pod: string;
  pgr: string;
  pod_transfer: string;
  pdr_transfer: string;
  postalBulletin: boolean;
  fiberMobileNumber: string;
}

export const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('L\'e-mail è obbligatoria'),
  vat: Yup.string().required('E\' richiesta l\'IVA'),
  iban: Yup.string().when([], ([], schema, values) => {
    const { value } = values;
    return value.length === 0 ? schema : schema.matches(italyIBANRegex, 'IBAN non valido, esempio "IT60X0542811101000000123456"').required('È richiesto l\'IBAN');
  }),
  firstName: Yup.string().required('Il nome del proprietario è obbligatorio'),
  companyName: Yup.string().required('Nome azienda/Cognome è obbligatorio'),
  operationAddress: Yup.string().required('È obbligatorio l\'indirizzo di fornitura completo di numero civico'),
  operationPostCode: Yup.string().required('È richiesto il codice postale'),
  operationProvince: Yup.string().required('La provincia è obbligatoria'),
  operationCity: Yup.string().required('La città è obbligatoria'),
  officeAddress: Yup.string().required('L\'indirizzo della sede legale è obbligatorio'),
  officePostCode: Yup.string().required('È richiesto il codice postale dell\'ufficio'),
  officeCity: Yup.string().required('La città dell\'ufficio è obbligatoria'),
  officeProvince: Yup.string().required('La provincia dell\'ufficio è obbligatoria'),
  mobileNumber: Yup.string().when([], ([], schema, values) => {
    const { value } = values;
    return value.length === 0 ? schema.required('Il numero di cellulare è obbligatorio') : schema.min(10, 'Il numero di cellulare ha una lunghezza minima di 10 cifre');
  }),
  phoneNumber: Yup.string().when([], ([], schema, values) => {
    const { value } = values;
    return value.length === 0 ? schema : schema.min(10, 'Il numero di telefono ha una lunghezza minima di 10 cifre');
  }),
  postalBulletin: Yup.boolean().when(['iban'], ([], schema, values) => {
    const { iban } = values.parent;
    return iban.length === 0 ? schema.required('Il campo è obbligatorio perché il campo l\'IBAN è vuoto') : schema;
  }),
  pod_transfer: Yup.string(),
  pdr_transfer: Yup.string(),
  fibra_transfer: Yup.string(),
  notes: Yup.string().notRequired(),
  gasSelected: Yup.boolean(),
  fibreSelected: Yup.boolean(),
  electricitySelected: Yup.boolean().when(['gasSelected', 'fibreSelected'], ([], schema, values) => {
    const { gasSelected, fibreSelected } = values.parent;
    if (values.value || gasSelected || fibreSelected) {
      return schema;
    }
    return schema.required('Il servizio clienti è obbligatorio');
  }),
  pod: Yup.string().when('electricitySelected', (electricitySelected, schema, values) => {
    if (electricitySelected[0] === true) {
      const { value } = values;
      return value.length === 0 ? schema.required('Il campo è obbligatorio') : schema.matches(/^IT001E\d{8,}$/, 'Il campo ha una lunghezza minima di 14 caratteri, esempio "IT001E12345678"');
    }
    return schema;
  }),
  pdr: Yup.string().when('gasSelected', (gasSelected, schema, values) => {
    if (gasSelected[0] === true) {
      const { value } = values;
      return value.length === 0 ? schema.required('Il campo è obbligatorio') : schema.min(14, 'Il campo ha una lunghezza minima di 14 cifre');
    }
    return schema;
  }),
  fiberMobileNumber: Yup.string().when(['fibreSelected', 'fibra_transfer'], ([], schema, values) => {
    const { fibreSelected, fibra_transfer } = values.parent;
    const { value } = values;

    if (fibreSelected && fibra_transfer === 'fibra_mnp') {
      return value.length === 0 ? schema.required('Il numero di cellulare è obbligatorio') : schema.min(10, 'Il numero di cellulare ha una lunghezza minima di 10 cifre');
    }
    return schema;
  }),
});

export const hiddenInputStyles = {
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
};

export const errorText = {
  color: '#f04438',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontWeight: 400,
  fontSize: '0.75rem',
  lineHeight: '1.66',
  textAlign: 'left',
  margin: '4px 14px 0 14px',
};
