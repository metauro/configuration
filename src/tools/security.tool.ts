import * as fs from 'fs';
import * as NodeRSA from 'node-rsa';
import { LoggerTool } from './logger.tool';

export class SecurityTool {
  static encrypt(decryptedValue: string, publicKeyPath: string): string {
    if (!fs.existsSync(publicKeyPath)) {
      LoggerTool.error('public key file does not exists');
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const rsa = new NodeRSA();
    rsa.importKey(publicKey, 'public');
    return rsa.encrypt(decryptedValue, 'utf8');
  }

  static decrypt(encryptedValue: string, privateKeyFilePath: string): string {
    if (!privateKeyFilePath) {
      LoggerTool.error('please special privateKeyFilePath');
    }

    if (!fs.existsSync(privateKeyFilePath)) {
      LoggerTool.error('private key file does not exists');
    }

    const privateKey = fs.readFileSync(privateKeyFilePath, 'utf8');
    const rsa = new NodeRSA();
    rsa.importKey(privateKey, 'private');
    return rsa.decrypt(encryptedValue, 'utf8');
  }
}
