// Comment out this line for now:
// import {
//   SSG_NAME_TAG_APP_RESET_STORAGE_ON_START,
//   SSG_NAME_TAG_APP_EMAIL,
//   SSG_NAME_TAG_APP_OCR_API_KEY,
// } from '@env';

// Direct fallback values:
const SSG_NAME_TAG_APP_RESET_STORAGE_ON_START = 'false'; // or 'false'
const SSG_NAME_TAG_APP_EMAIL = 'john@lowkeylabs.com';
const SSG_NAME_TAG_APP_OCR_API_KEY = 'K82228139188957';

console.log("✅ ENV import success", {
  SSG_NAME_TAG_APP_RESET_STORAGE_ON_START,
  SSG_NAME_TAG_APP_EMAIL,
  SSG_NAME_TAG_APP_OCR_API_KEY,
});

export const RESET_STORAGE_ON_START = SSG_NAME_TAG_APP_RESET_STORAGE_ON_START === 'true';
export const DEFAULT_EMAIL = SSG_NAME_TAG_APP_EMAIL || '';
export const DEFAULT_OCR_API_KEY = SSG_NAME_TAG_APP_OCR_API_KEY || '';
