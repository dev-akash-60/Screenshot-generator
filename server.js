const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/screenshot", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !/^https?:\/\//.test(url)) {
            return res.status(400).json({ error: "URL must start with http:// or https://" });
        }

        console.log("📌 Capturing screenshot for:", url);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const screenshot = await page.screenshot({ fullPage: true });
        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.send(screenshot);
    } catch (err) {
        console.error("🔥 Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
