// Image lazy loading via IntersectionObserver
(function() {
    var images = document.querySelectorAll('img.lazy-img[data-src]');
    if (images.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        images.forEach(function(img) {
            img.src = img.getAttribute('data-src');
            img.classList.remove('lazy-img');
            if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
        });
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var img = entry.target;
            img.src = img.getAttribute('data-src');
            img.classList.remove('lazy-img');
            observer.unobserve(img);

            img.onload = function() {
                if (img.hasAttribute('data-src')) img.removeAttribute('data-src');
            };
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });

    images.forEach(function(img) { observer.observe(img); });
})();
