// ts code was made by chatgpt :sob:
document.addEventListener("DOMContentLoaded", () => {
    const konamiCode = [
        "ArrowUp", "ArrowUp"
    ];
    let inputSequence = [];
    
    document.addEventListener("keydown", (event) => {
        inputSequence.push(event.key);
        if (inputSequence.length > konamiCode.length) {
            inputSequence.shift();
        }
        
        if (JSON.stringify(inputSequence) === JSON.stringify(konamiCode)) {
            window.location.href = "https://wither.lat/asdjdjnasjkdnakdjnsdfjfdlsjdnvcjnlaknvcvalnjvanljvankjvndav.html";
        }
    });
});