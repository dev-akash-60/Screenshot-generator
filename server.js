const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/screenshot", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send("No URL provided");
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--disable-software-rasterizer",
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        const screenshot = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.send(screenshot);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error capturing screenshot");
    }
});

// IMPORTANT: Render requires this
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
