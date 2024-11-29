document.addEventListener('DOMContentLoaded', function() {
    const publicationTags = document.querySelector('.publication-tags');
    const publications = document.querySelectorAll('.publications .entry');
    
    // Function to update active tag button
    function updateActiveTag(activeTag) {
        document.querySelectorAll('.publication-tags a').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tag') === activeTag) {
                btn.classList.add('active');
            }
        });
    }

    // Function to filter publications
    function filterPublications(tag) {
        publications.forEach(pub => {
            const pubTags = (pub.getAttribute('data-tags') || '').split(',').map(t => t.trim());
            if (tag === 'all' || pubTags.includes(tag)) {
                pub.style.display = '';
            } else {
                pub.style.display = 'none';
            }
        });
    }

    // Handle tag clicks
    publicationTags.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-tag')) {
            e.preventDefault();
            const tag = e.target.getAttribute('data-tag');
            updateActiveTag(tag);
            filterPublications(tag);
            // Update URL without page reload
            const newUrl = tag === 'all' ? 
                window.location.pathname : 
                `${window.location.pathname}#${tag}`;
            history.pushState(null, '', newUrl);
        }
    });

    // Handle initial load and back/forward navigation
    function handleUrlHash() {
        const hash = window.location.hash.slice(1);
        const tag = hash || 'all';
        updateActiveTag(tag);
        filterPublications(tag);
    }

    window.addEventListener('hashchange', handleUrlHash);
    handleUrlHash(); // Handle initial load
}); 