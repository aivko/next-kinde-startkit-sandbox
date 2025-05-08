import * as React from 'react';
import RouterLink from 'next/link';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
const { GearSix: GearSixIcon } = require('@phosphor-icons/react/dist/ssr/GearSix');
const { SignOut: SignOutIcon } = require('@phosphor-icons/react/dist/ssr/SignOut');
const { User: UserIcon } = require('@phosphor-icons/react/dist/ssr/User');

import { paths } from '@/paths';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  user: any;
}

export function UserPopover({ anchorEl, onClose, open, user }: UserPopoverProps): React.JSX.Element {
  const router = useRouter();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">
          {user?.given_name} {user?.family_name}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profilo
        </MenuItem>
        <MenuItem>
          <LogoutLink>
            <ListItemIcon>
              <SignOutIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Uscire
          </LogoutLink>
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
