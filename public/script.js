let imageBlob = null;

// Capture screenshot
async function capture() {
    const url = document.getElementById("url").value;
    if (!url) {
        alert("Please enter a URL");
        return;
    }

    const response = await fetch("/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    if (response.ok) {
        imageBlob = await response.blob();

        const img = document.getElementById("screenshot");
        img.src = URL.createObjectURL(imageBlob);

        document.getElementById("actions").style.display = "block";
    } else {
        alert("Failed to capture screenshot");
    }
}

// Download image
function download() {
    if (!imageBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(imageBlob);
    link.download = "screenshot.png";
    link.click();
}

// Share image (if supported)
async function share() {
    if (!imageBlob) return;

    if (navigator.share) {
        const file = new File([imageBlob], "screenshot.png", { type: "image/png" });

        try {
            await navigator.share({
                files: [file],
                title: "Website Screenshot",
                text: "Check out this screenshot!"
            });
        } catch (err) {
            console.log("Share canceled", err);
        }
    } else {
        alert("Sharing not supported in this browser");
    }
}

// Dark/light theme toggle
function toggleTheme() {
    const root = document.documentElement;

    if (document.body.classList.toggle("light")) {
        root.style.setProperty('--bg', '#f4f4f4');
        root.style.setProperty('--card', '#ffffff');
        root.style.setProperty('--text', '#111');
        root.style.setProperty('--border', '#ddd');
        root.style.setProperty('--primary', '#2563eb');
        root.style.setProperty('--primary-hover', '#1d4ed8');
    } else {
        root.style.setProperty('--bg', '#0f0f0f');
        root.style.setProperty('--card', '#181818');
        root.style.setProperty('--text', '#ffffff');
        root.style.setProperty('--border', '#272727');
        root.style.setProperty('--primary', '#4f46e5');
        root.style.setProperty('--primary-hover', '#4338ca');
    }
}
async function save() {
    if (!imageBlob) return;

    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);

    reader.onloadend = async function () {
        const base64data = reader.result.split(",")[1];

        const response = await fetch("/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64data })
        });

        if (response.ok) {
            const data = await response.json();
            alert("Saved! File: " + data.file);
        } else {
            alert("Save failed");
        }
    };
}
