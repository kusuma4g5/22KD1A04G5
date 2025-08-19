import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { urlMappings } from '../utils/dataStore';
import { log } from '../middleware/logMiddleware';

const RedirectPage = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const mapping = urlMappings.get(shortcode);

    if (mapping) {
      if (new Date() > mapping.expiryDate) {
        log('frontend', 'warn', 'redirect', `Attempt to access expired URL: ${shortcode}`);
        window.location.href = '/error/expired'; // A placeholder error page
      } else {
        mapping.clicks += 1;
        log('frontend', 'info', 'redirect', `Redirecting from ${shortcode} to ${mapping.longUrl}`);
        window.location.href = mapping.longUrl;
      }
    } else {
      log('frontend', 'error', 'redirect', `Shortcode not found: ${shortcode}`);
      window.location.href = '/error/not-found';
    }
  }, [shortcode]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
    </Box>
  );
};

export default RedirectPage;