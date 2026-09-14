import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(bodyParser.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(__dirname));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "assets/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.get("/content", (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({
            hero: { title:"", desc:"", btn:"" },
            skills: [],
            projects: [],
            contacts: [],
            footer: ""
        }, null, 2));
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
});

app.post("/content", (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ message: "saved" });
});

app.post("/assets", upload.single("file"), (req, res) => {
    if(!req.file) return res.status(400).json({error:"Dosya yüklenmedi"});
    const fileUrl = `http://localhost:${PORT}/assets/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
