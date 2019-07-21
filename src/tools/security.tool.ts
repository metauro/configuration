import { RSA } from '../algorithms/RSA';

export class SecurityTool {
  static encrypt(decryptedValue: string, publicKeyPath: string): string {
    return RSA.encrypt(decryptedValue, publicKeyPath);
  }

  static decrypt(encryptedValue: string, privateKeyFilePath: string): string {
    return RSA.decrypt(encryptedValue, privateKeyFilePath);
  }
}
