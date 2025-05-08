import * as React from 'react';
import Typography from "@mui/material/Typography";

export default function AgencyCardContent({ agency }) {
  return (
    <>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Nome della ditta:</b> { agency.companyName }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Email:</b> { agency.email }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Nome:</b> { agency.firstName }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>IBAN:</b> { agency.iban } | VAT: { agency.vat }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Numero di cellulare e numero di telefono:</b> { agency.mobileNumber }, { agency.phoneNumber }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Indirizzo dell'ufficio:</b> { agency.officeCity }, { agency.officeAddress }, { agency.officeProvince }, { agency.officePostCode }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Indirizzo dell'operazione:</b> { agency.operationCity }, { agency.operationAddress }, { agency.operationProvince }, { agency.operationPostCode }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Sito web:</b> { agency.website }
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        <b>Appunti:</b> { agency.notes }
      </Typography>
    </>
  );
}