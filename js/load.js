window.onload = function() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.transition = 'opacity 1s'; 
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
};