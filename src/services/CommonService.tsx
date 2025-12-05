import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const apiURL = import.meta.env.VITE_API_URL;


class CommonService {

  // ---------------------- 📅 Date Formatter ----------------------

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // gives dd/mm/yyyy
  }

  // Gives Nov 15th, 2025 format
  formatPrettyDate(dateString) {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = date.getDate();
    const suffix = (n) => (n > 3 && n < 21) ? "th" :
      ["th", "st", "nd", "rd"][(n % 10)] || "th";

    return `${months[date.getMonth()]} ${d}${suffix(d)}, ${date.getFullYear()}`;
  }

  // ---------------------- 🔐 AES Encryption ----------------------
  encrypt(text, key = secretKey) {
    return encodeURIComponent(CryptoJS.AES.encrypt(text, key).toString());
  }

  // ---------------------- 🔓 Decryption ----------------------
  decrypt(cipher, key = secretKey) {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(cipher), key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}

export default new CommonService();   // 📌 Singleton — usable anywhere

/*
HOW TO USE 
===========
import CommonService from "../services/CommonService";

// DATE USAGE
console.log(CommonService.formatPrettyDate("2025-11-15 00:00:00"));
// Output ➝ Nov 15th, 2025

// STORE SECRET KEY in .nv file of project root
      // VITE_SECRET_KEY=yourSuperSecretKey@123

// ENCRYPT
const encrypted = CommonService.encrypt("12345");
console.log("Encrypted:", encrypted);

// DECRYPT
console.log("Decrypted:", CommonService.decrypt(encrypted));
*/







