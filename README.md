# Playwright Vault

A Playwright testing framework with encrypted credential management.

## Secure Credential Management with Crypto Vault

This project includes a secure vault system for storing sensitive data like passwords, API keys, and tokens. The vault uses AES encryption to protect your credentials, keeping them out of your source code and environment files.

### How It Works

The vault system consists of two main components:

#### 1. CryptoVault Utility ([src/utils/crypto-vault.ts](src/utils/crypto-vault.ts))

The `CryptoVault` class provides encrypted storage for sensitive data:

- **Encryption**: Uses AES-256 encryption from the `crypto-js` library
- **Storage**: Encrypted data is stored in [config/vault.encrypted.json](config/vault.encrypted.json)
- **Key Management**: The encryption key is stored in your `.env` file as `VAULT_KEY`
- **Lazy Loading**: The vault key is only loaded when needed

**Key Methods:**
- `set(key, value)` - Encrypts and stores a value
- `get(key)` - Decrypts and retrieves a value
- `delete(key)` - Removes a stored value
- `list()` - Lists all stored keys (not values)

#### 2. Vault CLI ([src/cli/vault-cli.ts](src/cli/vault-cli.ts))

A command-line interface for managing vault contents:

```bash
npm run vault <command>
```

**Available Commands:**

| Command | Description |
|---------|-------------|
| `init` | Generate a new encryption key for your `.env` file |
| `set <key>` | Store an encrypted value (prompts for value, hidden input) |
| `get <key>` | Retrieve and display a decrypted value |
| `delete <key>` | Remove a stored value |
| `list` | Show all stored keys |

### Getting Started

#### Step 1: Initialize the Vault

Generate a new encryption key:

```bash
npm run vault init
```

This will output a `VAULT_KEY` that you should add to your `.env` file:

```
VAULT_KEY=<generated-key-here>
```

⚠️ **Important**:
- Never commit the `VAULT_KEY` to version control
- Store it securely (password manager, secrets manager, etc.)
- Without this key, you cannot decrypt your vault data

#### Step 2: Store Sensitive Data

Add credentials to the vault:

```bash
npm run vault set username
# Enter value for "username": ******* (hidden)
# ✅ Stored encrypted value for "username"

npm run vault set password
# Enter value for "password": ******* (hidden)
# ✅ Stored encrypted value for "password"
```

#### Step 3: Use in Your Tests

Access vault values in your Playwright tests:

```typescript
import { vault } from './src/utils/crypto-vault';

test('login with secure credentials', async ({ page }) => {
    const username = vault.get('username');
    const password = vault.get('password');

    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#login');
});
```

### Managing Vault Data

**List all stored keys:**
```bash
npm run vault list
```

**Retrieve a value:**
```bash
npm run vault get username
```

**Delete a value:**
```bash
npm run vault delete old-api-key
```

### Security Best Practices

1. **Never commit secrets** - Add `.env` to `.gitignore` (already configured)
2. **Commit the encrypted vault** - The [config/vault.encrypted.json](config/vault.encrypted.json) file is safe to commit
3. **Rotate keys regularly** - Periodically generate new vault keys and re-encrypt your data
4. **Backup your key** - Store the `VAULT_KEY` in a secure location (not in the repository)
5. **Use environment-specific keys** - Use different vault keys for development, staging, and production

### How Data is Encrypted

1. You run `vault set <key>` with a value
2. The value is encrypted using AES-256 with your `VAULT_KEY`
3. The encrypted data is stored as a JSON object in `vault.encrypted.json`
4. When you call `vault.get(key)`, the data is decrypted on-the-fly
5. The decrypted value is never written to disk

### Files Overview

```
├── .env                              # Contains VAULT_KEY (not committed)
├── config/
│   └── vault.encrypted.json          # Encrypted credentials (safe to commit)
├── src/
│   ├── cli/
│   │   └── vault-cli.ts             # CLI tool for vault management
│   └── utils/
│       └── crypto-vault.ts          # Core encryption/decryption logic
```
