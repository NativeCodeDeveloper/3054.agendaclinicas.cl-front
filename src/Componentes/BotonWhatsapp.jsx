"use client";
import * as React from 'react';
import Fab from '@mui/material/Fab';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';

const fabStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
};

const fabGreenStyle = {
  color: 'common.white',
  bgcolor: green[500],
  '&:hover': {
    bgcolor: green[600],
  },
};

export default function BotonWhatsapp() {
  const handleClick = () => {
    window.open('https://wa.me/+56985937487', '_blank');
  };

  return (
    <Box>
      <Fab
        sx={{ ...fabStyle, ...fabGreenStyle }}
        color="success"
        aria-label="WhatsApp"
        onClick={handleClick}
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
}
