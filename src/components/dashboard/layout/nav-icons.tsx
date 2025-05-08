const { User: UserIcon } = require('@phosphor-icons/react/dist/ssr/User');
const { Users: UsersIcon } = require('@phosphor-icons/react/dist/ssr/Users');
const { Info: Info } = require('@phosphor-icons/react/dist/ssr/Info');
const { Coins: Coins } = require('@phosphor-icons/react/dist/ssr/Coins');

export const navIcons = {
  user: UserIcon,
  users: UsersIcon,
  info: Info,
  coins: Coins,
} as Record<string, any>;
