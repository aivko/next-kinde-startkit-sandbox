import * as React from "react";
import { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { fetchCustomersList } from "@/components/dashboard/customer/api";
import { a11yProps, TabPanelProps, filterByStatus } from "@/components/dashboard/agency/constants";
import StickyTable from "@/components/dashboard/shared/StickyTable";
import CircularProgress from '@mui/material/CircularProgress';

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && ( <Box sx={{ pt: 2 }}> {children} </Box> )}
    </div>
  );
}

export default function AgencyTabs() {
  const [value, setValue] = React.useState(0);
  const [isLoading, setLoading] = React.useState<boolean | false>(false);
  const [filterSubmitted, setFilterSubmitted] = React.useState([]);
  const [filterAccepted, setFilterActivate] = React.useState([]);
  const [filterProcessing, setFilterProcessing] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getCustomers = () => {
    setLoading(true);
    fetchCustomersList()
      .then(res => {
        const { data } = res;
        setFilterSubmitted(filterByStatus(data, "submitted"));
        setFilterActivate(filterByStatus(data, "activate"));
        setFilterProcessing(filterByStatus(data, "processing"));
      })
      .catch(error => { console.log(error) })
      .finally(() => setLoading(false));
  }

  const handleEditCustomer = () => {
    getCustomers();
  }

  const handleDeleteCustomer = () => {
    getCustomers();
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{ pl: 2, pr: 2 }} label="Inviato" {...a11yProps(0)} />
          <Tab sx={{ pl: 2, pr: 2 }} label="In lavorazione" {...a11yProps(1)} />
          <Tab sx={{ pl: 2, pr: 2 }} label="Elaborato" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {isLoading
        ? <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}><CircularProgress /></Box>
        : <>
          <CustomTabPanel value={value} index={0}>
            {
              filterSubmitted.length > 0 && <StickyTable
                customers={filterSubmitted}
                handleEditCustomer={handleEditCustomer}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            }
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {
              filterProcessing.length > 0 && <StickyTable
                customers={filterProcessing}
                handleEditCustomer={handleEditCustomer}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            }
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {
              filterAccepted.length > 0 && <StickyTable
                customers={filterAccepted}
                handleEditCustomer={handleEditCustomer}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            }
          </CustomTabPanel>
        </>
      }
    </Box>
  );
}