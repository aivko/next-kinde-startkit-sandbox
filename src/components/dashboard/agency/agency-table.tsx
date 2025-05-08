import * as React from 'react';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { fetchAllCustomer } from "@/components/dashboard/customer/api";
import Chip from "@mui/material/Chip";
import StickyTable from "@/components/dashboard/shared/StickyTable";
import AgencyCardContent from "@/components/dashboard/agency/agency-card-content";

export default function AgencyTable({ agencies, adminInfo }) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [customers, setCustomers] = React.useState<[]>([]);
  const [isLoading, setLoading] = React.useState<boolean | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setCustomers([]);
    setExpanded(isExpanded ? panel : false);
  };

  const handleViewClients = (id: string) => {
    setLoading(true);
    fetchAllCustomer({ id })
      .then(res => {
        setCustomers(res.data.reverse());
      }).finally(() => {
        setLoading(false);
    })
  }

  const updateCustomers = (customers:any) => {
    setCustomers(customers)
  }

  return (
    <>
      {
        agencies.map(agency => (
          <Accordion
            key={agency.id}
            expanded={expanded === agency.id}
            onChange={handleChange(agency.id)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '30%', flexShrink: 0 }}>
                { agency.companyName }
              </Typography>
              <Typography sx={{ width: '40%', color: 'text.secondary' }}>
                { agency.email }
              </Typography>
              <Chip
                sx={{ lineHeight: 1 }}
                size="small"
                label={ agency.isVerified ? 'verificato' : 'non verificato' }
                color={ agency.isVerified ? 'success' : 'primary' } variant="outlined"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <AgencyCardContent agency={agency} />
                </CardContent>
                <CardActions>
                  <LoadingButton
                    onClick={() => handleViewClients(agency.id)}
                    loading={isLoading}
                    variant="outlined"
                  >
                    <span>Visualizza i clienti dell'agenzia</span>
                  </LoadingButton>
                </CardActions>
              </Card>
            </AccordionDetails>
            {
              customers.length > 0 && <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <StickyTable
                  customers={customers}
                  handleEditCustomer={updateCustomers}
                  handleDeleteCustomer={updateCustomers}
                  agencyData={agency}
                />
              </Paper>
            }
          </Accordion>
        ))
      }
    </>
  );
}
