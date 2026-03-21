'use client';

import { Box } from '@mui/material';


import React, { useState } from 'react';


export default function Reports(): React.ReactElement {
  
  return (
    <Box sx={{ display: 'flex' }}>
      
      <Box sx={{ flexGrow: 1 }}>
        
        <Box sx={{ p: 3 }}>
          <h1>Reports Page</h1>
          <p>This is the reports page content.</p>
        </Box>
      </Box>
    </Box>

  );
}   

