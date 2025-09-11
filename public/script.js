document.getElementById("captureBtn").addEventListener("click", async () => {
    const url = document.getElementById("urlInput").value.trim();
    const img = document.getElementById("screenshotImg");
    const spinner = document.getElementById("loading");
    const actionBtns = document.getElementById("actionBtns");

    if (!url) return alert("Please enter a valid URL");

    img.style.opacity = 0;
    spinner.classList.remove("hidden");
    actionBtns.classList.add("hidden");

    try {
        const res = await fetch("/screenshot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        if (!res.ok) throw new Error("Failed to capture screenshot");

        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
            spinner.classList.add("hidden");
            img.style.opacity = 1;
            actionBtns.classList.remove("hidden");

            // Save Button
            document.getElementById("downloadBtn").onclick = () => {
                const link = document.createElement("a");
                link.href = img.src;
                link.download = "screenshot.png";
                link.click();
            };

            // Share Button
            document.getElementById("shareBtn").onclick = async () => {
                if (navigator.share) {
                    const file = new File([blob], "screenshot.png", { type: "image/png" });
                    await navigator.share({
                        title: "Website Screenshot",
                        text: "Check out this screenshot",
                        files: [file]
                    });
                } else {
                    alert("Sharing is not supported on this browser.");
                }
            };
        };
    } catch (err) {
        spinner.classList.add("hidden");
        alert(err.message);
    }
});
