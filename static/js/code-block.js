// Mac-style code block dots and language label (lvbibir style)
(function() {
    document.querySelectorAll('.post-content pre').forEach(function(pre) {
        if (pre.querySelector('.mac-tool')) return;

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

        var macTool = document.createElement('div');
        macTool.className = 'mac-tool';
        macTool.innerHTML = '<span class="mac bb1"></span><span class="mac bb2"></span><span class="mac bb3"></span>';

        if (lang) {
            var langLabel = document.createElement('span');
            langLabel.className = 'language-type';
            langLabel.textContent = lang;
            macTool.appendChild(langLabel);
        }

        pre.style.position = 'relative';
        pre.insertBefore(macTool, pre.firstChild);
    });
})();
