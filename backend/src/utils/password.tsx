const hash = async (password: string): Promise<string> => {
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Use PBKDF2 with high iterations for better security
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 600000, // OWASP recommendation for PBKDF2-SHA256
            hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const saltArray = Array.from(salt);

    // Convert to hex and concatenate: salt + hash
    const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return saltHex + hashHex;
};

const verify = async (password: string, storedHash: string): Promise<boolean> => {
    // Extract salt (first 32 hex chars = 16 bytes) and hash
    const saltHex = storedHash.slice(0, 32);
    const originalHash = storedHash.slice(32);

    // Convert salt back to Uint8Array
    const salt = new Uint8Array(
        saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 600000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex === originalHash;
};

export { hash, verify };
