import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { urlMappings } from '../utils/dataStore';
import { log } from '../middleware/logMiddleware';

const StatisticsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const mappings = Array.from(urlMappings.values());
    setData(mappings);
    log('frontend', 'info', 'stats', `Statistics page loaded with ${mappings.length} entries.`);
  }, []);

  if (data.length === 0) {
    return <Typography variant="h6">No shortened URLs to display.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Shortened URL</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.shortcode}>
                <TableCell>{row.longUrl}</TableCell>
                <TableCell>{window.location.origin}/{row.shortcode}</TableCell>
                <TableCell>{new Date(row.creationDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(row.expiryDate).toLocaleString()}</TableCell>
                <TableCell>{row.clicks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatisticsPage;