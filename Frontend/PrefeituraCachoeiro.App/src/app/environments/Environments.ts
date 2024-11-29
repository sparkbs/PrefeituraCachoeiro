import * as CryptoJS from 'crypto-js';

export const Environments = {
    APIUrl: "http://3.137.147.34:8080/v1",
    key: CryptoJS.enc.Utf8.parse('1234567890123456'), // 16 bytes para AES-128
    iv: CryptoJS.enc.Utf8.parse('6543210987654321')
}