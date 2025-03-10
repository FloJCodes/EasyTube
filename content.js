// Finds and removes selected Elements on site
function removeElements() {
    const paidElements = document.querySelectorAll('.ytmPaidContentOverlayHost');
    const topRightElements = document.querySelectorAll('.ytInlinePlayerControlsTopRightControls');
    
    paidElements.forEach(item1 => {
        item1.style.display = 'none';
    });
    topRightElements.forEach(item4 => {
        item4.style.display = 'none';
    });
}

// Function to fetch and display dislike counts
async function showDislikeCount() {
    // Check if we're on a video page
    if (!window.location.pathname.includes('/watch')) return;
    
    // Extract video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    if (!videoId) return;
    
    try {
        // Fetch dislike data from Return YouTube Dislike API
        const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
        const data = await response.json();
        
        // Format the dislike count
        let dislikeCount = data.dislikes;
        if (dislikeCount >= 1000000) {
            dislikeCount = (dislikeCount / 1000000).toFixed(1) + 'M';
        } else if (dislikeCount >= 1000) {
            dislikeCount = (dislikeCount / 1000).toFixed(1) + 'K';
        }

        console.log("Dislikes: ", dislikeCount);

        const dislikeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end');
            console.log("Hab was gefunden!");
            const div = document.createElement('div');
            div.classList.add("yt-spec-button-shape-next__button-text-content");
            div.textContent = dislikeCount;
            dislikeButton.appendChild(div); 

    } 
    catch (error) {
        console.error('Error fetching dislike count:', error);
    }
}

// Function to handle URL changes (for SPA navigation)
function handleURLChange() {
    removeElements();
    showDislikeCount();
}

// Catches Mutations/Changes on site
const observer = new MutationObserver(() => {
    removeElements();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial execution
removeElements();
showDislikeCount();

// Listen for YouTube's navigation events (it's a single-page application)
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        handleURLChange();
    }
}).observe(document, { subtree: true, childList: true });