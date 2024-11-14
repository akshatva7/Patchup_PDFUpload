// src/App.jsx
import React from 'react';

import DropArea from './components/DropArea';
import {
  Typography,
  Box,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function App() {
 
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#333', // Matches body background-color from CSS
        color: 'white',  // Sets text color to white
        padding: 4,      // Equivalent to 32px (spacing unit of 8px * 4)
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"           // Defines the heading level
        align="center"         // Centers the text horizontally
        gutterBottom           // Adds margin below the heading
        sx={{
          fontWeight: 'bold', // Makes the heading bold
          mb: 3,               // Adds bottom margin
        }}
      >
        PDF Parser App
      </Typography>
      
      {/* Logout Button */}
      <Button
        variant="contained"
        color="success"            // Green color as per `.logout-button` CSS
        startIcon={<LogoutIcon />} // Adds a logout icon to the button
        sx={{
          mb: 4,                   // Adds bottom margin
          borderRadius: '50px',    // Makes the button circular
          padding: '12px 24px',    // Matches `.logout-button` padding
          fontSize: '16px',        // Sets font size
          fontWeight: 'bold',      // Makes text bold
          textTransform: 'none',   // Prevents uppercase transformation
          '&:hover': {
            backgroundColor: '#45a049', // Slightly darker green on hover
          },
        }}
      >
        Logout
      </Button>

      {/* Drop Area */}
      <DropArea />
    </Box>
  );
}

export default App;
