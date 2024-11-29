import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Environments } from '../environments/Environments';

@Injectable()
export class AESEncryptDecriptService {
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(
      value,
      Environments.key,
      {
        iv: Environments.iv
      }
    ).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(
      textToDecrypt,
      Environments.key,
      {
        iv: Environments.iv
      }
    ).toString(CryptoJS.enc.Utf8);
  }
}
