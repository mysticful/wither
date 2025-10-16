const searchInput = document.getElementById("gxSearch");
    const gameLinks = document.querySelectorAll(".bttn");
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      gameLinks.forEach(game => {
        const alt = game.querySelector("div.bttn").alt.toLowerCase();
        game.style.display = alt.includes(query) ? "inline-block" : "none";
      });
    });