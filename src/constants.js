// /src/utils/constants.js

// API base URL for the Reqres API
export const API_BASE_URL = "https://reqres.in/api";

// Authentication constants
export const LOGIN_ENDPOINT = "/login";
export const USERS_ENDPOINT = "/users";

// Default user credentials for login (as per the assignment)
export const DEFAULT_USER_CREDENTIALS = {
  email: "eve.holt@reqres.in",
  password: "cityslicka",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please try again.",
  UNAUTHORIZED: "Unauthorized access. Please check your login credentials.",
  USER_NOT_FOUND: "User not found.",
  GENERAL_ERROR: "An error occurred. Please try again later.",
};

// Pagination constants (adjust these if needed for pagination controls)
export const PAGINATION = {
  PAGE_SIZE: 6, // Number of users per page
};

// Local Storage constants (for token management)
export const LOCAL_STORAGE_KEYS = {
  TOKEN: "auth_token",
};
