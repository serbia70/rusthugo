// Zola search - adapted for elasticlunr_javascript format

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
}

function formatSearchResultItem(item, terms) {
  return '<li class="post-entry">' +
            '<header class="entry-header">' + item.doc.title + '&nbsp;&raquo;</header>' +
            '<a href="' + item.ref + '" aria-label="' + item.doc.title + '"></a>' +
          '</li>';
}

function initSearch() {
  var input = document.getElementById("searchInput");
  var results = document.getElementById("searchResults");
  if (!input || !results) return;

  var idx = null;
  if (window.searchIndex && typeof elasticlunr !== 'undefined') {
    idx = elasticlunr.Index.load(window.searchIndex);
  }

  if (!idx) {
    results.innerHTML = '<li>搜索索引加载失败，请刷新重试</li>';
    return;
  }

  input.addEventListener("input", debounce(function() {
    var term = input.value.trim();
    if (term.length < 2) {
      results.innerHTML = '';
      return;
    }

    var searchResults = idx.search(term, { expand: true });
    var html = '';
    for (var i = 0; i < Math.min(searchResults.length, 20); i++) {
      html += formatSearchResultItem(searchResults[i], term);
    }
    if (searchResults.length === 0) {
      html = '<li>没有找到结果</li>';
    }
    results.innerHTML = html;
  }, 200));
}

if (window.searchIndex) {
  initSearch();
} else {
  document.addEventListener('DOMContentLoaded', initSearch);
}
