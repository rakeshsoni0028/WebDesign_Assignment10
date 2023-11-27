import { Typography } from '@mui/material';
import React from 'react';

const SectionHeader = ({ title, mb }) => {
  return (
    <Typography
      variant="h5"
      component="h5"
      sx={{
        fontSize: { xs: '12px', sm: '16px', md: '20px' },
        color: 'rgba(255,255,255,.7)',
        fontWeight: '400',
        lineHeight: 1,
        textAlign: 'center',
        fontFamily: 'Roboto Condensed',
        marginBottom: '1.4rem',
      }}
    >
      {title}
    </Typography>
  );
};

export default SectionHeader;
