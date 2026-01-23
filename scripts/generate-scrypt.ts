
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { hex } from "@better-auth/utils/hex";

// Copying logic from better-auth source
const config = {
	N: 16384,
	r: 16,
	p: 1,
	dkLen: 64
};

async function generateKey(password: string, salt: string) {
	return await scryptAsync(password.normalize("NFKC"), salt, {
		N: config.N,
		p: config.p,
		r: config.r,
		dkLen: config.dkLen,
		maxmem: 128 * config.N * config.r * 2
	});
}

const hashPassword = async (password: string) => {
	const salt = hex.encode(crypto.getRandomValues(new Uint8Array(16)));
	const key = await generateKey(password, salt);
	return `${salt}:${hex.encode(key)}`;
};

async function main() {
    const password = "password123";
    const hash = await hashPassword(password);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
}

main();
