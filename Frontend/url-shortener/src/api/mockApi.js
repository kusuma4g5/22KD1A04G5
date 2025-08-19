import { urlMappings } from '../utils/dataStore';
import { log } from '../middleware/logMiddleware';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateShortcode = () => {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const shortenUrl = async (longUrl, customCode, validityMinutes) => {
  const shortcode = customCode || generateShortcode();

  if (urlMappings.has(shortcode)) {
    log('frontend', 'error', 'api', `Shortcode collision detected for: ${shortcode}`);
    throw new Error('Shortcode already in use. Please choose another.');
  }

  
  if (customCode && customCode.length < 4) {
      log('frontend', 'error', 'api', `Invalid custom shortcode length: ${customCode}`);
      throw new Error('Custom shortcode must be at least 4 characters long.');
  }

  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + (validityMinutes || 30));

  const newMapping = {
    longUrl,
    shortcode,
    creationDate: new Date(),
    expiryDate,
    clicks: 0,
    clickData: [],
  };
  
  urlMappings.set(shortcode, newMapping);
  log('frontend', 'info', 'api', `URL shortened successfully: ${shortcode}`);

  return newMapping;
};