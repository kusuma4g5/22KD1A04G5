import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import URLShortenerPage from './pages/URLShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import { log } from '../src/middleware/logMiddleware';

function App() {
  useEffect(() => {
    log('frontend', 'info', 'app', 'Application started successfully.');
  }, []);

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shorten URL</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<URLShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortcode" element={<RedirectPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;