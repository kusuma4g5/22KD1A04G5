import axios from 'axios';
const AUTH_TOKEN = "FXCwtY";

export const log = async (stack, level, packageName, message) => {
  console.log('Attempting to log:', { stack, level, packageName, message });

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      { stack, level, package: packageName, message },
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AUTH_TOKEN}` } }
    );
    console.log('Log sent successfully!');
  } catch (error) {
    console.error('Log failed:', error.response?.data || error.message);
  }
};