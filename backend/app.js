import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { fileURLToPath } from 'url';
// import client from "./db.js"
import { randomPassword } from "chatujs";
import path from "path";
import fs from "node:fs/promises";

let map = "";
try {
    const data = await fs.readFile('total.txt', 'utf8');
    const entries = JSON.parse(data);
    if (Array.isArray(entries)) {
        map = new Map(entries);
    } else {
        console.error('Data format is incorrect. Expected an array of entries.');
        map = new Map();
    }
} catch (err) {
    console.error('Read failed:', err);
    process.exit(1);
}

dotenv.config();
const app = express();
const PORT = process.env.PORT;
console.log("PORT:", PORT);

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
// console.log(import.meta);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    let shortId = "";
    while (true) {
        shortId = randomPassword(8);
        // const data = await client.get(shortId);
        const data = map.has(shortId);
        if (!data) {
            break;
        }
    }
    // await client.set(shortId, longUrl);
    map.set(shortId, longUrl);
    // res.status(200).json({ shortUrl: `http://${req.headers.host.split(":")[0]}:${PORT}/${shortId}` });
    res.status(200).json({ shortUrl: `https://url-shortener-xiao.onrender.com/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    // const longUrl = await client.get(shortId);
    const longUrl = map.get(shortId);
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).json({ error: "URL not found" });
    }
});

setInterval(async () => {
    try {
        await fs.writeFile('total.txt', JSON.stringify([...map]), 'utf8');
    } catch (err) {
        console.error('Append failed:', err);
    }
}, 30000);

app.get('/total', async (req, res) => {
    try {
        const data = await fs.readFile('total.txt', 'utf8');
        const entries = JSON.parse(data);
        const total = entries.length;
        res.status(200).json({ total: total });
    } catch (err) {
        console.error('Read failed:', err);
        res.status(500).json({ error: 'Failed to read total count' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});