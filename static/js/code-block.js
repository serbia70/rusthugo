// Mac-style code block dots and language label
(function() {
    document.querySelectorAll('.post-content pre').forEach(function(pre) {
        if (pre.querySelector('.mac-dots')) return;

        var code = pre.querySelector('code[class*="language-"]');
        var lang = '';
        if (code) {
            var classes = code.className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                if (classes[i].startsWith('language-')) {
                    lang = classes[i].replace('language-', '').toUpperCase();
                    break;
                }
            }
        }

        var macDots = document.createElement('div');
        macDots.className = 'mac-dots';
        macDots.innerHTML = '<span class="mac-dot red"></span><span class="mac-dot yellow"></span><span class="mac-dot green"></span>';

        if (lang) {
            var langLabel = document.createElement('span');
            langLabel.className = 'code-lang';
            langLabel.textContent = lang;
            macDots.appendChild(langLabel);
        }

        pre.style.position = 'relative';
        pre.insertBefore(macDots, pre.firstChild);
    });
})();
