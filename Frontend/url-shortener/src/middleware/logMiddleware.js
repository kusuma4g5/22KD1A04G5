import axios from 'axios';

// IMPORTANT: Replace with the token you obtained from the authentication API.
const AUTH_TOKEN = "FXCwtY";

export const log = async (stack, level, packageName, message) => {
  // Temporarily added console.log for debugging purposes.
  // REMOVE THIS BEFORE FINAL SUBMISSION.
  console.log('Attempting to log:', { stack, level, packageName, message });

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      { stack, level, package: packageName, message },
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AUTH_TOKEN}` } }
    );
    // Temporarily added console.log for debugging purposes.
    // REMOVE THIS BEFORE FINAL SUBMISSION.
    console.log('Log sent successfully!');
  } catch (error) {
    // Temporarily added console.error for debugging purposes.
    // REMOVE THIS BEFORE FINAL SUBMISSION.
    console.error('Log failed:', error.response?.data || error.message);
  }
};