import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { fileURLToPath } from 'url';
// import db from "./db.js"


dotenv.config();
const app = express();
const PORT = process.env.PORT;

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});