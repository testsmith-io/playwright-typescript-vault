import * as fs from 'fs';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config( { path: path.resolve( process.cwd(), '.env' ) } );

interface VaultData {
    [key: string]: string;
}

class CryptoVault {
    private vaultPath = './config/vault.encrypted.json';
    private secretKey: string | null = null;

    private getKey (): string {
        // Lazy load the key - only when needed
        if ( !this.secretKey ) {
            this.secretKey = process.env.VAULT_KEY || '';
            if ( !this.secretKey ) {
                throw new Error( 'VAULT_KEY not set in environment. Run "npm run vault init" to generate a key.' );
            }
        }
        return this.secretKey;
    }

    private loadVault (): VaultData {
        if ( !fs.existsSync( this.vaultPath ) ) {
            return {};
        }
        const encrypted = fs.readFileSync( this.vaultPath, 'utf-8' );
        const decrypted = CryptoJS.AES.decrypt( encrypted, this.getKey() ).toString( CryptoJS.enc.Utf8 );
        return decrypted ? JSON.parse( decrypted ) : {};
    }

    private saveVault ( data: VaultData ): void {
        const encrypted = CryptoJS.AES.encrypt( JSON.stringify( data ), this.getKey() ).toString();
        fs.mkdirSync( './config', { recursive: true } );
        fs.writeFileSync( this.vaultPath, encrypted );
    }

    set ( key: string, value: string ): void {
        const vault = this.loadVault();
        vault[key] = value;
        this.saveVault( vault );
    }

    get ( key: string ): string {
        const vault = this.loadVault();
        if ( !vault[key] ) {
            throw new Error( `Key "${key}" not found in vault` );
        }
        return vault[key];
    }

    delete ( key: string ): void {
        const vault = this.loadVault();
        delete vault[key];
        this.saveVault( vault );
    }

    list (): string[] {
        return Object.keys( this.loadVault() );
    }
}

export const vault = new CryptoVault();