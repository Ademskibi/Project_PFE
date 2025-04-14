// src/utils/tokenUtils.js
import { jwtDecode as jwt_decode } from 'jwt-decode';
export function isTokenExpired(token) {
  try {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now(); // exp is in seconds, Date.now() in ms
  } catch (error) {
    return true; // if decoding fails, treat it as expired
  }
}
