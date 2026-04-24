import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { fileURLToPath } from 'url';
import client from "./db.js"
import { randomPassword } from "chatujs";
import path from "path";

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
        shortId = randomPassword(6);
        const data = await client.get(shortId);
        if (!data) {
            break;
        }
    }
    await client.set(shortId, longUrl);
    res.json({ shortUrl: `http://${req.headers.host.split(":")[0]}:${PORT}/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    const longUrl = await client.get(shortId);
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).json({ error: "URL not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});