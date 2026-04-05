if (window.location.pathname.includes('/gx/')) {
    const script = document.createElement('script');
    script.src = '/js/mobile.js'; 
    document.head.appendChild(script);
    console.log("mobile script worked.");
}
