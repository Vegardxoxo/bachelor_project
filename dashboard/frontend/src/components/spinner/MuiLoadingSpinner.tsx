import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function MuiLoadingSpinner() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center', // centers horizontally
            alignItems: 'center', // centers vertically
            height: '100vh' // or set a fixed height if needed
        }}>
            <CircularProgress size={80}/>
        </Box>
    );
}
