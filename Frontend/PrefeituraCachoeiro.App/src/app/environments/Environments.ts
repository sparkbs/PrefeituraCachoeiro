import * as CryptoJS from 'crypto-js';

export const Environments = {
    APIUrl: "https://minha-api-producao-dtfha5efafezfhe6.brazilsouth-01.azurewebsites.net/v1/",
    key: CryptoJS.enc.Utf8.parse('1234567890123456'), // 16 bytes para AES-128
    iv: CryptoJS.enc.Utf8.parse('6543210987654321')
}