import { red, green, grey, blue, orange } from '@mui/material/colors';

export const LABEL_STATUSES = {
  submitted: 'Inviato',
  progress: 'In lavorazione',
  accepted: 'Accettata',
  rejected: 'Rifiutata',
  activate: 'Attiva',
}

export const LABEL_COLORS = {
  submitted: 'default',
  progress: 'primary',
  accepted: 'success',
  rejected: 'error',
  activate: 'secondary',
}

export const LABEL_BG_COLORS = {
  submitted: grey[500],
  progress: orange[500],
  accepted: green[500],
  rejected: red[500],
  activate: blue[500],
}

export const setStatusLabel = (status: string) => {
  return LABEL_STATUSES[status]
}

export const setStatusColors = (status: string) => {
  return LABEL_COLORS[status]
}

export const setStatusIconsColors = (status: string) => {
  return LABEL_BG_COLORS[status]
}