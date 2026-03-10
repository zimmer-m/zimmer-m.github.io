document.addEventListener('DOMContentLoaded', function() {
    const publicationTags = document.querySelector('.publication-tags');
    const publications = document.querySelectorAll('.publications .entry');
    const searchInput = document.getElementById('pub-search-input');

    let activeTag = 'all';
    let searchQuery = '';

    // Function to update active tag button
    function updateActiveTag(tag) {
        activeTag = tag;
        document.querySelectorAll('.publication-tags a').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tag') === tag) {
                btn.classList.add('active');
            }
        });
    }

    // Get searchable text from a publication entry
    function getSearchableText(pub) {
        if (pub._searchText) return pub._searchText;

        var parts = [];
        var titleEl = pub.querySelector('.title');
        if (titleEl) parts.push(titleEl.textContent);

        var authorEl = pub.querySelector('.author');
        if (authorEl) parts.push(authorEl.textContent);

        var periodicalEls = pub.querySelectorAll('.periodical');
        periodicalEls.forEach(function(el) { parts.push(el.textContent); });

        var abstractEl = pub.querySelector('.abstract p');
        if (abstractEl) parts.push(abstractEl.textContent);

        pub._searchText = parts.join(' ').toLowerCase();
        return pub._searchText;
    }

    // Unified filter: applies both tag and search filters
    function applyFilters() {
        var query = searchQuery.toLowerCase().trim();
        var terms = query ? query.split(/\s+/) : [];

        publications.forEach(function(pub) {
            var tagMatch = true;
            if (activeTag !== 'all') {
                var pubTags = (pub.getAttribute('data-tags') || '').split(',').map(function(t) { return t.trim(); });
                tagMatch = pubTags.indexOf(activeTag) !== -1;
            }

            var searchMatch = true;
            if (terms.length > 0) {
                var text = getSearchableText(pub);
                searchMatch = terms.every(function(term) {
                    return text.indexOf(term) !== -1;
                });
            }

            pub.style.display = (tagMatch && searchMatch) ? '' : 'none';
        });

        // Show/hide year headers that have no visible publications
        updateYearHeaders();
    }

    // Hide year headers (h2.year) when all their publications are hidden
    function updateYearHeaders() {
        var yearHeaders = document.querySelectorAll('.publications h2.year');
        yearHeaders.forEach(function(header) {
            var next = header.nextElementSibling;
            var hasVisible = false;
            while (next && !next.matches('h2.year')) {
                if (next.querySelector('.entry') && next.querySelector('.entry').style.display !== 'none') {
                    hasVisible = true;
                    break;
                }
                // Check if next itself is an entry
                if (next.classList && next.classList.contains('entry') && next.style.display !== 'none') {
                    hasVisible = true;
                    break;
                }
                next = next.nextElementSibling;
            }
            header.style.display = hasVisible ? '' : 'none';
        });
    }

    // Handle tag clicks
    if (publicationTags) {
        publicationTags.addEventListener('click', function(e) {
            if (e.target.hasAttribute('data-tag')) {
                e.preventDefault();
                var tag = e.target.getAttribute('data-tag');
                updateActiveTag(tag);
                applyFilters();
                // Update URL without page reload
                var newUrl = tag === 'all' ?
                    window.location.pathname :
                    window.location.pathname + '#' + tag;
                history.pushState(null, '', newUrl);
            }
        });
    }

    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            applyFilters();
        });

        // Clear search on Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchQuery = '';
                applyFilters();
                this.blur();
            }
        });
    }

    // Handle initial load and back/forward navigation
    function handleUrlHash() {
        var hash = window.location.hash.slice(1);
        var tag = hash || 'all';
        updateActiveTag(tag);
        applyFilters();

        // If we're on the main page and there's a hash, scroll to publications
        if (window.location.pathname === '/' && hash) {
            var publicationsSection = document.querySelector('.publications');
            if (publicationsSection) {
                publicationsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    window.addEventListener('hashchange', handleUrlHash);
    handleUrlHash(); // Handle initial load
});
