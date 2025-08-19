import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { shortenUrl } from '../api/mockApi';
import { log } from '../middleware/logMiddleware';

const formFields = [
  { id: 'longUrl1', label: 'Long URL 1', name: 'longUrl', defaultValidity: 30 }
];

const URLShortenerPage = () => {
  const [formState, setFormState] = useState(formFields.map(() => ({ longUrl: '', validity: '', shortcode: '' })));
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (index, field) => (event) => {
    const newFormState = [...formState];
    newFormState[index][field] = event.target.value;
    setFormState(newFormState);
  };

  const validate = (index) => {
    const { longUrl, validity, shortcode } = formState[index];
    const newErrors = { ...errors };

    // Basic URL validation
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (longUrl && !urlRegex.test(longUrl)) {
      newErrors[`longUrl${index}`] = 'Invalid URL format';
    } else {
      delete newErrors[`longUrl${index}`];
    }

    // Validity validation
    if (validity && (isNaN(validity) || parseInt(validity) <= 0)) {
      newErrors[`validity${index}`] = 'Validity must be a positive integer';
    } else {
      delete newErrors[`validity${index}`];
    }

    // Shortcode validation
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (shortcode && !alphanumericRegex.test(shortcode)) {
      newErrors[`shortcode${index}`] = 'Shortcode must be alphanumeric';
    } else {
      delete newErrors[`shortcode${index}`];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults([]);
    let successfulShortens = 0;

    for (let i = 0; i < formState.length; i++) {
      if (!formState[i].longUrl) continue;
      
      const isValid = validate(i);
      if (isValid) {
        try {
          const { longUrl, validity, shortcode } = formState[i];
          const result = await shortenUrl(longUrl, shortcode, validity ? parseInt(validity) : 30);
          setResults(prev => [...prev, result]);
          successfulShortens++;
        } catch (err) {
          log('frontend', 'error', 'page', `Failed to shorten URL: ${formState[i].longUrl}`);
          setErrors(prev => ({ ...prev, [`longUrl${i}`]: err.message }));
        }
      }
    }
    log('frontend', 'info', 'page', `${successfulShortens} URL(s) shortened successfully.`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Develop a React URL Shortener Web App
      </Typography>
      <form onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={field.label}
              value={formState[index].longUrl}
              onChange={handleChange(index, 'longUrl')}
              error={!!errors[`longUrl${index}`]}
              helperText={errors[`longUrl${index}`] || ''}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Validity Period (in minutes, optional)"
              value={formState[index].validity}
              onChange={handleChange(index, 'validity')}
              error={!!errors[`validity${index}`]}
              helperText={errors[`validity${index}`] || ''}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              value={formState[index].shortcode}
              onChange={handleChange(index, 'shortcode')}
              error={!!errors[`shortcode${index}`]}
              helperText={errors[`shortcode${index}`] || ''}
            />
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Shorten
        </Button>
      </form>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Results
          </Typography>
          {results.map((result, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  **Original URL:** {result.longUrl}
                </Typography>
                <Typography variant="body1">
                  **Shortened URL:** <a href={`/${result.shortcode}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{result.shortcode}</a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  **Expires on:** {new Date(result.expiryDate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default URLShortenerPage;