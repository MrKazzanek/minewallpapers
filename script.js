document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wallpaperGrid = document.getElementById('wallpaper-grid');
    const categorySelect = document.getElementById('category-select');
    const searchInput = document.getElementById('search-input');
    const wallpaperCountElement = document.getElementById('wallpaper-count');
    const randomWallpaperBtn = document.getElementById('random-wallpaper-btn');
    const publishBtn = document.getElementById('publish-btn');
    const languageBtn = document.getElementById('language-btn');
    const currentYearSpan = document.getElementById('current-year');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const banner = document.getElementById('banner-slideshow');

    // Modal elements
    const modal = document.getElementById('image-preview-modal');
    const modalImg = document.getElementById('preview-image');
    const modalDownloadButton = document.getElementById('preview-download-button'); // Button for download/redirect
    const closeModalBtn = document.querySelector('.modal .close-btn');
    // Modal Detail Elements
    const modalTitle = document.getElementById('modal-wallpaper-title');
    const modalAuthor = document.getElementById('modal-wallpaper-author');
    const modalCategory = document.getElementById('modal-wallpaper-category');
    const modalDescription = document.getElementById('modal-wallpaper-description');

    // State
    let currentLanguage = localStorage.getItem('mineWallpapersLang') || 'en';
    let currentWallpapers = []; // Filtered wallpapers
    const themeOrder = ['system', 'light', 'dark']; // Theme toggle order
    let bannerInterval; // Banner slideshow interval
    let currentBannerIndex = 0;
    let bannerLayer1Active = true; // Tracks which banner layer pseudo-element is active
    let currentModalWallpaperData = null; // Store data for the currently open modal wallpaper

    // --- Content Protection Event Listeners ---
    // Disable right-click context menu
    document.body.oncontextmenu = (e) => { e.preventDefault(); return false; };

    // Disable drag start for images specifically
    document.addEventListener('dragstart', (event) => {
        if (event.target.tagName === 'IMG') {
             event.preventDefault(); // Prevent dragging images
        }
    });
    // Note: Text selection is disabled via CSS (user-select: none;) on the body

    // --- Helper Functions ---

    function getInterfaceTranslation(key, lang = currentLanguage, replacements = {}) {
        // Handle nested keys (e.g., themeToggleButton.system)
        const keys = key.split('.');
        let text = interfaceTranslations[lang]; // Start from the language object
        try {
            keys.forEach(k => { text = text[k]; }); // Traverse down the keys
             // Check if the final value is actually found
             if (text === undefined) {
                 throw new Error(`Translation key not found: ${key}`);
             }
        } catch (e) {
            // console.warn(`Translation error: ${e.message}`); // Optional warning
            text = key; // Return the original key as fallback
        }
        text = text || key; // Final fallback if text becomes null/undefined during traversal

        // Apply replacements
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }


    function getCategoryName(categoryKey, lang = currentLanguage) {
         return categoryDefinitions[categoryKey]?.[lang] || categoryKey;
    }

    function getWallpaperTextData(wallpaperId, lang = currentLanguage) {
         return wallpaperContentTranslations[lang]?.[wallpaperId] || {};
    }

    // Kept for potential future use or context, but not for download name now
    function generateFilename(wallpaperBase, wallpaperText, lang) {
        const title = (wallpaperText.title || `wallpaper_${wallpaperBase.id}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const author = (wallpaperBase.author || 'unknown').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        return `MineWallpaper_${title}_by_${author}`;
    }

     function openPreviewModal(wallpaperId) {
        const wallpaperBase = wallpapersData.find(w => w.id === wallpaperId);
        const wallpaperText = getWallpaperTextData(wallpaperId, currentLanguage);

        // Check existence of essential elements and data
        if (!wallpaperBase || !wallpaperText.title || !modal || !modalImg || !modalDownloadButton || !modalTitle || !modalAuthor || !modalCategory || !modalDescription) {
             console.error("Cannot open preview - missing data or modal elements.", wallpaperId);
             return;
        }

        // Store data including the download page URL
        currentModalWallpaperData = { base: wallpaperBase, text: wallpaperText };

        // Set image
        modalImg.src = wallpaperBase.image_full;
        modalImg.alt = getInterfaceTranslation('previewAlt', currentLanguage, { title: wallpaperText.title });

        // Populate details
        modalTitle.textContent = wallpaperText.title;
        modalAuthor.innerHTML = `<strong>${getInterfaceTranslation('authorLabel', currentLanguage)}</strong> ${wallpaperBase.author || 'N/A'}`;

        const categoryKey = wallpaperText.category_key;
        const categoryName = categoryKey ? getCategoryName(categoryKey, currentLanguage) : '';
        if (categoryName) {
            modalCategory.innerHTML = `<strong>${getInterfaceTranslation('categoryLabel', currentLanguage)}</strong> ${categoryName}`;
            modalCategory.style.display = 'block';
        } else {
            modalCategory.style.display = 'none';
        }

        modalDescription.textContent = wallpaperText.description || '';

        // Display the modal
        modal.style.display = "flex"; // Use flex for centering the inner content
        document.body.classList.add('modal-open'); // Add class to body to disable scroll
    }

    function closePreviewModal() {
        if (!modal || !modalImg) return;
        modal.style.display = "none"; // Hide the modal
        modalImg.src = ""; // Clear image src

        currentModalWallpaperData = null; // Clear stored data

        // Clear modal text fields
        if(modalTitle) modalTitle.textContent = '';
        if(modalAuthor) modalAuthor.textContent = '';
        if(modalCategory) { modalCategory.textContent = ''; modalCategory.style.display = 'none'; }
        if(modalDescription) modalDescription.textContent = '';

        // Re-enable button just in case (though it shouldn't be disabled now)
        if(modalDownloadButton) modalDownloadButton.disabled = false;

        document.body.classList.remove('modal-open'); // Remove class from body to re-enable scroll
    }

    // --- forceDownload function REMOVED ---


    // --- Standard UI Update Functions ---
    function updateStaticTexts(lang) {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (el.id !== 'random-wallpaper-btn') {
                el.textContent = getInterfaceTranslation(key, lang);
            } else {
                el.setAttribute('aria-label', getInterfaceTranslation(key, lang));
            }
        });
        document.querySelectorAll('[data-translate-count]').forEach(el => {
            const key = el.getAttribute('data-translate-count');
            el.textContent = getInterfaceTranslation(key, lang, { count: wallpapersData.length });
        });
        document.querySelectorAll('[data-translate-lang]').forEach(el => {
             const key = el.getAttribute('data-translate-lang');
             el.textContent = getInterfaceTranslation(key, lang);
        });
        document.querySelectorAll('[data-translate-title]').forEach(el => {
            const key = el.getAttribute('data-translate-title');
            el.title = getInterfaceTranslation(key, lang);
        });

        if(searchInput) searchInput.placeholder = getInterfaceTranslation('searchPlaceholder', lang);
        if(languageBtn) languageBtn.textContent = getInterfaceTranslation('languageButton', lang);
        // Update modal download button text
        if(modalDownloadButton) modalDownloadButton.textContent = getInterfaceTranslation('previewDownload', lang);
        if (closeModalBtn) closeModalBtn.title = getInterfaceTranslation('closePreview', lang);

        updateThemeButton(localStorage.getItem('mineWallpapersTheme') || 'system');
    }

    function populateCategories(lang) {
        if (!categorySelect) return;
        const currentCategoryValue = categorySelect.value;
        categorySelect.innerHTML = '';
        Object.keys(categoryDefinitions).forEach(categoryKey => {
            const option = document.createElement('option');
            option.value = categoryKey;
            option.textContent = getCategoryName(categoryKey, lang);
            categorySelect.appendChild(option);
        });
         if (categoryDefinitions[currentCategoryValue]) {
            categorySelect.value = currentCategoryValue;
         }
    }

    // --- Display Wallpapers Function (Modified for Redirect) ---
    function displayWallpapers(wallpapersToDisplay) {
        if (!wallpaperGrid) return;
        wallpaperGrid.innerHTML = '';

        if (wallpapersToDisplay.length === 0) {
            wallpaperGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${getInterfaceTranslation('noResults', currentLanguage)}</p>`;
            return;
        }

        const currentCategoryFilterKey = categorySelect ? categorySelect.value : 'all';
        const showCategoryTag = currentCategoryFilterKey === 'all';
        const fragment = document.createDocumentFragment();

        wallpapersToDisplay.forEach(wallpaper => {
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            if (!textData.title) {
                console.warn(`Missing translation for wallpaper ID: ${wallpaper.id} in language ${currentLanguage}`);
                return;
            }

            const wallpaperItem = document.createElement('div');
            wallpaperItem.classList.add('wallpaper-item');
            wallpaperItem.dataset.id = wallpaper.id;

            const title = textData.title;
            const description = textData.description || '';
            const categoryKey = textData.category_key;
            const categoryName = categoryKey ? getCategoryName(categoryKey, currentLanguage) : '';
            const author = wallpaper.author;

            // Use the download_page_url for the link's href
            const downloadPageUrl = wallpaper.download_page_url || '#'; // Fallback to '#' if URL is missing

            wallpaperItem.innerHTML = `
                <div class="wallpaper-image-container">
                    <img src="${wallpaper.image_thumb || ''}" alt="${title}" loading="lazy" draggable="false">
                </div>
                <div class="wallpaper-info">
                    <h3>${title}</h3>
                    <p class="author"><strong>${getInterfaceTranslation('authorLabel', currentLanguage)}</strong> ${author || 'N/A'}</p>
                    ${description ? `<p class="description">${description}</p>` : ''}
                    ${showCategoryTag && categoryName ? `<p class="category-tag" data-category-key="${categoryKey || 'other'}"><strong>${getInterfaceTranslation('categoryLabel', currentLanguage)}</strong> ${categoryName}</p>` : ''}
                    <a href="${downloadPageUrl}" target="_blank" rel="noopener noreferrer" class="download-btn">${getInterfaceTranslation('downloadButton', currentLanguage)}</a>
                </div>
            `;

            const imgContainer = wallpaperItem.querySelector('.wallpaper-image-container');
            if (imgContainer) {
                imgContainer.addEventListener('click', () => {
                    openPreviewModal(wallpaper.id);
                });
            }

            fragment.appendChild(wallpaperItem);
        });

        wallpaperGrid.appendChild(fragment);
    }
    // --- END displayWallpapers ---

    function filterAndSearchWallpapers() {
        const selectedCategoryKey = categorySelect ? categorySelect.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        currentWallpapers = wallpapersData.filter(wallpaper => {
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            if (!textData || !textData.title) return false;

            const categoryKey = textData.category_key;
            const isCategoryMatch = selectedCategoryKey === 'all' || categoryKey === selectedCategoryKey;
            if (!isCategoryMatch) return false;

            if (searchTerm) {
                const title = (textData.title || '').toLowerCase();
                const author = (wallpaper.author || '').toLowerCase();
                const description = (textData.description || '').toLowerCase();
                return title.includes(searchTerm) || author.includes(searchTerm) || description.includes(searchTerm);
            }
            return true;
        });

        displayWallpapers(currentWallpapers);
    }

    // --- Theme Logic ---
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        let themeToApply = theme;
        if (theme === 'system') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeToApply = prefersDark ? 'dark' : 'light';
        }
        document.body.classList.add(themeToApply === 'dark' ? 'dark-theme' : 'light-theme');
    }
    function updateThemeButton(theme) {
        if (!themeToggleButton) return;
        const iconElement = themeToggleButton.querySelector('i');
        if (!iconElement) return;
        let iconClass = 'fa-circle-half-stroke'; let ariaLabelKey = 'themeToggleButton.system';
        if (theme === 'light') { iconClass = 'fa-sun'; ariaLabelKey = 'themeToggleButton.light'; }
        else if (theme === 'dark') { iconClass = 'fa-moon'; ariaLabelKey = 'themeToggleButton.dark'; }
        iconElement.className = `fas ${iconClass}`;
        themeToggleButton.setAttribute('aria-label', getInterfaceTranslation(ariaLabelKey, currentLanguage));
    }
    function setTheme(theme) {
         applyTheme(theme);
         localStorage.setItem('mineWallpapersTheme', theme);
         updateThemeButton(theme);
    }

    // --- Banner Slideshow Logic ---
    function startBannerSlideshow() {
        if (!banner) return;
        const imagesAttr = banner.getAttribute('data-banner-images');
        if (!imagesAttr) return;
        let images = [];
        try { images = JSON.parse(imagesAttr); } catch (e) { console.error("Error parsing data-banner-images:", e); return; }
        if (!Array.isArray(images) || images.length < 2) {
            if (images.length === 1) { banner.style.setProperty('--banner-bg-layer1', `url('${images[0]}')`); }
            else { console.warn("Not enough banner images for slideshow (need at least 2)."); }
            return;
        }

        let nextImageIndex = 1; // Start preloading the second image
        let imagePreload = new Image();

        const preloadNextImage = () => {
            nextImageIndex = (currentBannerIndex + 1) % images.length;
            imagePreload = new Image();
            imagePreload.onload = () => { /* Image preloaded */ };
            imagePreload.onerror = () => { console.error("Failed to preload banner image:", images[nextImageIndex]); };
            if (images[nextImageIndex]) { imagePreload.src = images[nextImageIndex]; }
        };

        const changeBannerBackground = () => {
            const nextImageUrl = images[nextImageIndex];
            if (!nextImageUrl) return;

            // Set preloaded image on the hidden layer and fade layers
            if (bannerLayer1Active) {
                banner.style.setProperty('--banner-bg-layer2', `url('${nextImageUrl}')`);
                banner.style.setProperty('--banner-opacity-layer1', '0');
                banner.style.setProperty('--banner-opacity-layer2', '1');
            } else {
                banner.style.setProperty('--banner-bg-layer1', `url('${nextImageUrl}')`);
                banner.style.setProperty('--banner-opacity-layer1', '1');
                banner.style.setProperty('--banner-opacity-layer2', '0');
            }

            bannerLayer1Active = !bannerLayer1Active;
            currentBannerIndex = nextImageIndex;

            // Start preloading the *next* image after the transition starts
            preloadNextImage();
        };

        // Initial setup
        banner.style.setProperty('--banner-bg-layer1', `url('${images[currentBannerIndex]}')`);
        banner.style.setProperty('--banner-opacity-layer1', '1');
        banner.style.setProperty('--banner-opacity-layer2', '0');
        bannerLayer1Active = true;

        // Preload the second image immediately
        preloadNextImage();

        // Clear old interval and start new one
        if (bannerInterval) clearInterval(bannerInterval);
        bannerInterval = setInterval(changeBannerBackground, 5000); // Change every 5 seconds
    }
    // Set initial opacity variables (needed for CSS transitions)
    banner?.style.setProperty('--banner-opacity-layer1', '1');
    banner?.style.setProperty('--banner-opacity-layer2', '0');


    // --- Event Listeners ---
    categorySelect?.addEventListener('change', filterAndSearchWallpapers);
    searchInput?.addEventListener('input', filterAndSearchWallpapers);

    randomWallpaperBtn?.addEventListener('click', () => {
         const availableIds = currentWallpapers.map(w => w.id);
        if (availableIds.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableIds.length);
            openPreviewModal(availableIds[randomIndex]);
        } else {
             const categoryKey = categorySelect ? categorySelect.value : 'all';
             const anyInCategory = wallpapersData.some(w => { const textData = getWallpaperTextData(w.id, currentLanguage); return textData && (categoryKey === 'all' || textData.category_key === categoryKey); });
             alert(getInterfaceTranslation(anyInCategory ? 'noResults' : 'noWallpapersInCategory', currentLanguage));
        }
    });
    if(randomWallpaperBtn) { randomWallpaperBtn.classList.add('icon-button'); if(!randomWallpaperBtn.querySelector('i.fa-dice')) { randomWallpaperBtn.innerHTML = '<i class="fas fa-dice"></i>'; } }

    publishBtn?.addEventListener('click', () => { if (typeof publishUrl !== 'undefined' && publishUrl) { window.open(publishUrl, '_blank'); } else { console.warn("publishUrl is not defined."); } });

    languageBtn?.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        localStorage.setItem('mineWallpapersLang', currentLanguage);
        updateStaticTexts(currentLanguage);
        populateCategories(currentLanguage);
        filterAndSearchWallpapers();
    });

    // Modal listeners
    closeModalBtn?.addEventListener('click', closePreviewModal);
    modal?.addEventListener('click', (event) => { if (event.target === modal) closePreviewModal(); }); // Close on backdrop click
    document.addEventListener('keydown', (event) => { if (event.key === "Escape" && modal?.style.display === "flex") closePreviewModal(); });

    // Modal Download Button Listener (Redirects)
    modalDownloadButton?.addEventListener('click', () => {
        if (currentModalWallpaperData?.base?.download_page_url) {
            window.open(currentModalWallpaperData.base.download_page_url, '_blank');
        } else {
            console.error("Missing download page URL for modal wallpaper.");
            alert(getInterfaceTranslation('downloadFailed', currentLanguage) || 'Download failed.');
        }
    });

    // Theme Toggle Button Listener
    themeToggleButton?.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('mineWallpapersTheme') || 'system';
        const currentIndex = themeOrder.indexOf(currentTheme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
        setTheme(nextTheme);
    });

    // System Theme Change Listener
    try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => { const currentThemeSetting = localStorage.getItem('mineWallpapersTheme') || 'system'; if (currentThemeSetting === 'system') { applyTheme('system'); updateThemeButton('system'); } };
        if (mediaQuery.addEventListener) { mediaQuery.addEventListener('change', handleChange); }
        else if (mediaQuery.addListener) { mediaQuery.addListener(handleChange); }
    } catch(e) { console.warn("System theme change detection not fully supported."); }


    // --- Initialization ---
    function initialize() {
        if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
        updateStaticTexts(currentLanguage);
        populateCategories(currentLanguage);
        const savedTheme = localStorage.getItem('mineWallpapersTheme') || 'system';
        setTheme(savedTheme);
        filterAndSearchWallpapers();
        if (wallpaperCountElement) {
            wallpaperCountElement.textContent = getInterfaceTranslation('bannerCount', currentLanguage, { count: wallpapersData.length });
        }
        startBannerSlideshow();
    }

    // Run initialization
    initialize();
});