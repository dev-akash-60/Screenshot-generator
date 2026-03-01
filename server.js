const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Ensure screenshots folder exists
const saveDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
}

app.post("/screenshot", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });
        const screenshot = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.send(screenshot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
});

// New Save Endpoint
app.post("/save", async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: "No image data" });
    }

    const buffer = Buffer.from(image, "base64");
    const filename = `screenshot-${Date.now()}.png`;
    const filePath = path.join(saveDir, filename);

    fs.writeFileSync(filePath, buffer);

    res.json({ message: "Saved", file: filename });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
