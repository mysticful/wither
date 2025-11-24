function filterGx() {
    const searchInput = document.getElementById("gxSearch").value.toLowerCase();
    const gx = document.querySelectorAll("bttn");

    games.forEach(game => {
        const gameName = gx.getAttribute("name").toLowerCase();
        if (gameName.includes(searchInput)) {
            gx.style.display = "block";
        } else {
            gx.style.display = "none";
        }
    });
}