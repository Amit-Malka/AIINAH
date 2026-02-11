import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.resolve(__dirname, '..', '.env.local');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

(async () => {
    let shouldCreate = true;

    if (fs.existsSync(envLocalPath)) {
        console.log('.env.local already exists.');
        const answer = await askQuestion('Do you want to overwrite it? (y/N): ');
        if (answer.trim().toLowerCase() !== 'y') {
            shouldCreate = false;
        }
    }

    if (shouldCreate) {
        const apiKey = await askQuestion('Enter your HeyGen API Key: ');
        if (!apiKey) {
            console.error('No API key provided. Exiting without saving.');
            rl.close();
            return;
        }

        const envContent = `HEYGEN_API_KEY=${apiKey}\n`;
        fs.writeFileSync(envLocalPath, envContent);
        console.log(`Saved HEYGEN_API_KEY to ${envLocalPath}`);
    } else {
        console.log('Skipping .env.local creation.');
    }

    // Check .gitignore
    const gitignorePath = path.resolve(__dirname, '..', '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        if (!gitignoreContent.includes('.env.local') && !gitignoreContent.includes('/.env.local')) {
            fs.appendFileSync(gitignorePath, '\n.env.local\n');
            console.log('Added .env.local to .gitignore');
        }
    } else {
        fs.writeFileSync(gitignorePath, '.env.local\n');
        console.log('Created .gitignore with .env.local');
    }

    rl.close();
})();
