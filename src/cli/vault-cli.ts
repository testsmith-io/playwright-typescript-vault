#!/usr/bin/env node
import { Command } from 'commander';
import * as readline from 'readline';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config( { path: path.resolve( process.cwd(), '.env' ) } );

import { vault } from '../utils/crypto-vault';

const program = new Command();
const rl = readline.createInterface( {
    input: process.stdin,
    output: process.stdout
} );

const askHidden = ( question: string ): Promise<string> => {
    return new Promise( ( resolve ) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        stdout.write( question );
        stdin.setRawMode( true );
        stdin.resume();
        stdin.setEncoding( 'utf8' );

        let password = '';
        stdin.on( 'data', ( char: string ) => {
            if ( char === '\n' || char === '\r' ) {
                stdin.setRawMode( false );
                stdin.pause();
                stdout.write( '\n' );
                resolve( password );
            } else if ( char === '\u0003' ) {
                process.exit();
            } else if ( char === '\u007f' ) {
                password = password.slice( 0, -1 );
            } else {
                password += char;
                stdout.write( '*' );
            }
        } );
    } );
};

program
    .name( 'vault' )
    .description( 'Manage encrypted credentials' )
    .version( '1.0.0' );

program
    .command( 'set <key>' )
    .description( 'Store an encrypted value' )
    .action( async ( key: string ) => {
        const value = await askHidden( `Enter value for "${key}": ` );
        vault.set( key, value );
        console.log( `✅ Stored encrypted value for "${key}"` );
        process.exit( 0 );
    } );

program
    .command( 'get <key>' )
    .description( 'Retrieve a decrypted value' )
    .action( ( key: string ) => {
        try {
            const value = vault.get( key );
            console.log( `${key}: ${value}` );
        } catch ( error ) {
            // Fix: Properly handle the error type
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error( `❌ ${errorMessage}` );
        }
    } );

program
    .command( 'delete <key>' )
    .description( 'Delete a value' )
    .action( ( key: string ) => {
        vault.delete( key );
        console.log( `✅ Deleted "${key}"` );
    } );

program
    .command( 'list' )
    .description( 'List all keys' )
    .action( () => {
        const keys = vault.list();
        if ( keys.length === 0 ) {
            console.log( 'Vault is empty' );
        } else {
            console.log( 'Keys in vault:' );
            keys.forEach( key => console.log( `  - ${key}` ) );
        }
    } );

program
    .command( 'init' )
    .description( 'Initialize vault with a new key' )
    .action( () => {
        const key = CryptoJS.lib.WordArray.random( 256 / 8 ).toString();
        console.log( 'Generated VAULT_KEY for your .env file:' );
        console.log( `\nVAULT_KEY=${key}\n` );
        console.log( '⚠️  Save this key securely! You cannot recover data without it.' );
    } );

program.parse();