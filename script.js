document.addEventListener('DOMContentLoaded', () => {
    // --- JAWNE UKRYCIE MODALA PODGLĄDU NA STARCIE ---
    const imagePreviewModalForStartup = document.getElementById('image-preview-modal');
    if (imagePreviewModalForStartup) {
        imagePreviewModalForStartup.style.display = 'none';
    }
    // --- KONIEC JAWNEGO UKRYCIA ---

    // --- DOM Elements ---
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
    const logoLink = document.getElementById('logo-link');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const loadingScreen = document.getElementById('loading-screen');

    // Modal elements
    const modal = document.getElementById('image-preview-modal');
    const modalImg = document.getElementById('preview-image');
    const modalDownloadButton = document.getElementById('preview-download-button');
    const closeModalBtn = document.querySelector('#image-preview-modal .close-btn'); // More specific selector
    // Modal Detail Elements
    const modalTitle = document.getElementById('modal-wallpaper-title');
    const modalAuthor = document.getElementById('modal-wallpaper-author');
    const modalCategory = document.getElementById('modal-wallpaper-category');
    const modalDescription = document.getElementById('modal-wallpaper-description');

    // First Time Setup Modal Elements
    const firstTimeModal = document.getElementById('first-time-modal');
    const setupLangButtons = firstTimeModal?.querySelectorAll('.button-group button[data-lang]');
    const setupThemeButtons = firstTimeModal?.querySelectorAll('.button-group button[data-theme]');
    const confirmSetupBtn = document.getElementById('confirm-setup-btn');

    // --- State ---
    let currentLanguage = localStorage.getItem('mineWallpapersLang') || 'pl'; // Default to Polish if no setup
    let allWallpapersData = []; // Holds the original data from data.js
    let filteredWallpapers = []; // Wallpapers matching filters/search
    let randomizableWallpaperIds = []; // IDs available for randomization
    const themeOrder = ['system', 'light', 'dark'];
    let bannerInterval;
    let currentBannerIndex = 0;
    let bannerLayer1Active = true;
    let currentModalWallpaperData = null;
    let setupLanguageChoice = currentLanguage;
    let setupThemeChoice = localStorage.getItem('mineWallpapersTheme') || 'system';

    // --- Content Protection Event Listeners ---
    document.body.oncontextmenu = (e) => { e.preventDefault(); return false; };
    document.addEventListener('dragstart', (event) => {
        if (event.target.tagName === 'IMG') { event.preventDefault(); }
    });

    // --- Helper Functions ---
    function getInterfaceTranslation(key, lang = currentLanguage, replacements = {}) {
        const keys = key.split('.');
        let text = interfaceTranslations[lang];
        try {
            keys.forEach(k => { text = text[k]; });
            if (text === undefined) { throw new Error(`Translation key not found: ${key}`); }
        } catch (e) {
            text = key; // Fallback to key
        }
        text = text || key; // Final fallback
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

    function getCategoryName(categoryKey, lang = currentLanguage) {
        return categoryDefinitions[categoryKey]?.[lang] || categoryKey;
    }

    function getWallpaperTextData(wallpaperId, lang = currentLanguage) {
        // Find wallpaper base data first to ensure ID exists
        const baseData = allWallpapersData.find(w => w.id === wallpaperId);
        if (!baseData) return {}; // Return empty if ID doesn't exist in base data

        // Then try to get translations
        return wallpaperContentTranslations[lang]?.[wallpaperId] || {};
    }

    // Function to open the preview modal
    function openPreviewModal(wallpaperId) {
        console.log(`Attempting to open preview for ID: ${wallpaperId}`); // Debug log
        const wallpaperBase = allWallpapersData.find(w => w.id === wallpaperId);
        const wallpaperText = getWallpaperTextData(wallpaperId, currentLanguage);

        if (!wallpaperBase || !modal || !modalImg || !modalDownloadButton || !modalTitle || !modalAuthor || !modalCategory || !modalDescription) {
            console.error("Cannot open preview - missing base data or modal elements.", { wallpaperId, wallpaperBase, modalExists: !!modal });
            return;
        }
         // Check if title exists, although description/category might be missing
         if (!wallpaperText.title) {
            console.warn(`Preview opened, but missing title translation for wallpaper ID: ${wallpaperId} in language ${currentLanguage}`);
            // We can still show the image and author
         }


        currentModalWallpaperData = { base: wallpaperBase, text: wallpaperText };
        modalImg.src = ""; // Clear previous image first
        modalImg.src = wallpaperBase.image_full; // Set new source
        modalImg.alt = getInterfaceTranslation('previewAlt', currentLanguage, { title: wallpaperText.title || `Wallpaper ${wallpaperId}` });
        modalTitle.textContent = wallpaperText.title || `Wallpaper ${wallpaperId}`;
        modalAuthor.innerHTML = `<strong>${getInterfaceTranslation('authorLabel', currentLanguage)}:</strong> ${wallpaperBase.author || 'N/A'}`;

        const categoryKey = wallpaperText.category_key;
        const categoryName = categoryKey ? getCategoryName(categoryKey, currentLanguage) : '';
        if (categoryName) {
            modalCategory.innerHTML = `<strong>${getInterfaceTranslation('categoryLabel', currentLanguage)}:</strong> ${categoryName}`;
            modalCategory.style.display = 'block';
        } else {
            modalCategory.style.display = 'none';
        }

        modalDescription.textContent = wallpaperText.description || '';

        modal.style.display = "flex";
        document.body.classList.add('modal-open');
        console.log(`Preview modal displayed for ID: ${wallpaperId}`); // Debug log
    }

    // Function to close the preview modal
    function closePreviewModal() {
        if (!modal || !modalImg) return;
        modal.style.display = "none";
        modalImg.src = ""; // Important to clear src
        currentModalWallpaperData = null;
        if (modalTitle) modalTitle.textContent = '';
        if (modalAuthor) modalAuthor.textContent = '';
        if (modalCategory) { modalCategory.textContent = ''; modalCategory.style.display = 'none'; }
        if (modalDescription) modalDescription.textContent = '';
        if (modalDownloadButton) modalDownloadButton.disabled = false;
        document.body.classList.remove('modal-open');
        console.log("Preview modal closed"); // Debug log
    }

    // --- UI Update Functions ---
    function updateStaticTexts(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.innerHTML = getInterfaceTranslation(key, lang);
        });
        document.querySelectorAll('[data-translate-count]').forEach(el => {
            const key = el.getAttribute('data-translate-count');
            el.textContent = getInterfaceTranslation(key, lang, { count: allWallpapersData.length });
        });
        document.querySelectorAll('[data-translate-lang]').forEach(el => {
            const key = el.getAttribute('data-translate-lang');
            el.textContent = getInterfaceTranslation(key, lang);
        });
        document.querySelectorAll('[data-translate-title]').forEach(el => {
            const key = el.getAttribute('data-translate-title');
            el.title = getInterfaceTranslation(key, lang);
        });
        document.querySelectorAll('[data-translate-aria]').forEach(el => {
            const key = el.getAttribute('data-translate-aria');
            el.setAttribute('aria-label', getInterfaceTranslation(key, lang));
        });
        if (randomWallpaperBtn) {
            randomWallpaperBtn.setAttribute('aria-label', getInterfaceTranslation('randomButton', lang));
        }
        if (searchInput) searchInput.placeholder = getInterfaceTranslation('searchPlaceholder', lang);
        if (languageBtn) languageBtn.textContent = getInterfaceTranslation('languageButton', lang);
        if (modalDownloadButton) modalDownloadButton.textContent = getInterfaceTranslation('previewDownload', lang);
        if (closeModalBtn) closeModalBtn.title = getInterfaceTranslation('closePreview', lang);
        updateThemeButton(localStorage.getItem('mineWallpapersTheme') || 'system');
    }

    function populateCategories(lang) {
        if (!categorySelect) return;
        const currentCategoryValue = categorySelect.value;
        categorySelect.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = getCategoryName('all', lang);
        categorySelect.appendChild(allOption);
        Object.keys(categoryDefinitions).forEach(categoryKey => {
            if (categoryKey === 'all') return;
            const option = document.createElement('option');
            option.value = categoryKey;
            option.textContent = getCategoryName(categoryKey, lang);
            categorySelect.appendChild(option);
        });
        if (categoryDefinitions[currentCategoryValue] || currentCategoryValue === 'all') {
            categorySelect.value = currentCategoryValue;
        } else {
            categorySelect.value = 'all';
        }
    }

    // --- Display Wallpapers Function (Corrected HTML Generation) ---
    function displayWallpapers(wallpapersToDisplay) {
        if (!wallpaperGrid) return;
        wallpaperGrid.innerHTML = ''; // Clear previous items

        if (wallpapersToDisplay.length === 0) {
            wallpaperGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${getInterfaceTranslation('noResults', currentLanguage)}</p>`;
            return;
        }

        const currentCategoryFilterKey = categorySelect ? categorySelect.value : 'all';
        // Show category tag ONLY IF 'all' categories are selected in the dropdown
        const showCategoryTag = currentCategoryFilterKey === 'all';
        const fragment = document.createDocumentFragment();

        wallpapersToDisplay.forEach(wallpaper => {
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            // Require at least a title or use ID as fallback title
            const title = textData.title || `Wallpaper ${wallpaper.id}`;
            const description = textData.description || '';
            const categoryKey = textData.category_key;
            const categoryName = categoryKey ? getCategoryName(categoryKey, currentLanguage) : '';
            const author = wallpaper.author;
            const downloadPageUrl = wallpaper.download_page_url || '#';
            const isNew = wallpaper.is_new || false;

            const wallpaperItem = document.createElement('div');
            wallpaperItem.classList.add('wallpaper-item');
            wallpaperItem.dataset.id = wallpaper.id; // Store ID for preview click

            // --- Corrected Inner HTML Structure ---
            wallpaperItem.innerHTML = `
                <div class="wallpaper-image-container" data-wallpaper-id="${wallpaper.id}">
                    ${isNew ? `<span class="new-tag">${getInterfaceTranslation('newTag', currentLanguage)}</span>` : ''}
                    <img src="${wallpaper.image_thumb || ''}" alt="${title}" loading="lazy" draggable="false">
                </div>
                <div class="wallpaper-info">
                    <h3>${title}</h3>
                    <p class="author"><strong>${getInterfaceTranslation('authorLabel', currentLanguage)}:</strong> ${author || 'N/A'}</p>
                    ${description ? `<p class="description">${description}</p>` : ''}
                    ${showCategoryTag && categoryName ? `<p class="category-tag" data-category-key="${categoryKey || 'other'}"><strong>${getInterfaceTranslation('categoryLabel', currentLanguage)}:</strong> ${categoryName}</p>` : ''}
                    <a href="${downloadPageUrl}" target="_blank" rel="noopener noreferrer" class="download-btn">${getInterfaceTranslation('downloadButton', currentLanguage)}</a>
                </div>
            `;

            // Add click listener for preview AFTER setting innerHTML
             const imgContainer = wallpaperItem.querySelector('.wallpaper-image-container');
             if (imgContainer) {
                 imgContainer.addEventListener('click', (e) => {
                     // Get the ID directly from the clicked element's dataset
                     const clickedId = parseInt(e.currentTarget.dataset.wallpaperId, 10);
                     if (clickedId) {
                          console.log(`Image container clicked, ID: ${clickedId}`); // Debug log
                          openPreviewModal(clickedId);
                     } else {
                          console.error("Could not get wallpaper ID from clicked element.");
                     }
                 });
             }

            fragment.appendChild(wallpaperItem);
        });

        wallpaperGrid.appendChild(fragment);
    }
    // --- END displayWallpapers ---

    // --- Filter and Search Logic ---
    function filterAndSearchWallpapers() {
        const selectedCategoryKey = categorySelect ? categorySelect.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        filteredWallpapers = allWallpapersData.filter(wallpaper => { // Filter from the full list
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            // Basic check: wallpaper must exist in translations (at least have an entry)
            // Allow wallpapers without full text data if ID matches, but prioritize those with data for searching
            if (searchTerm && Object.keys(textData).length === 0) {
                 return false; // Don't include in search results if no text data
            }

            const categoryKey = textData.category_key;
            const isCategoryMatch = selectedCategoryKey === 'all' || categoryKey === selectedCategoryKey;

            if (!isCategoryMatch) return false; // Filter by category first

            // If search term exists, filter by text content
            if (searchTerm) {
                const title = (textData.title || '').toLowerCase();
                const author = (wallpaper.author || '').toLowerCase();
                const description = (textData.description || '').toLowerCase();
                const categoryName = (selectedCategoryKey === 'all' && categoryKey) ? getCategoryName(categoryKey, currentLanguage).toLowerCase() : '';

                return title.includes(searchTerm) ||
                       author.includes(searchTerm) ||
                       description.includes(searchTerm) ||
                       (categoryName && categoryName.includes(searchTerm)) ||
                       wallpaper.id.toString() === searchTerm; // Allow searching by ID
            }

            return true; // Pass if category matches and no search term
        });

        displayWallpapers(filteredWallpapers);

        // Point 9: Reset randomizable pool based on new filter results
        randomizableWallpaperIds = filteredWallpapers.map(w => w.id);
        console.log("Filters applied. Displaying:", filteredWallpapers.length, "wallpapers. Random pool count:", randomizableWallpaperIds.length); // Debug log
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
        // (No changes needed here based on the issues)
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
        let nextImageIndex = 1;
        let imagePreload = new Image();
        const preloadNextImage = () => {
            nextImageIndex = (currentBannerIndex + 1) % images.length;
            imagePreload = new Image();
            imagePreload.onload = () => { /* Preloaded */ };
            imagePreload.onerror = () => { console.error("Failed to preload banner image:", images[nextImageIndex]); };
            if (images[nextImageIndex]) { imagePreload.src = images[nextImageIndex]; }
        };
        const changeBannerBackground = () => {
            const nextImageUrl = images[nextImageIndex];
            if (!nextImageUrl) return;
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
            preloadNextImage();
        };
        banner.style.setProperty('--banner-bg-layer1', `url('${images[currentBannerIndex]}')`);
        banner.style.setProperty('--banner-opacity-layer1', '1');
        banner.style.setProperty('--banner-opacity-layer2', '0');
        bannerLayer1Active = true;
        preloadNextImage();
        if (bannerInterval) clearInterval(bannerInterval);
        bannerInterval = setInterval(changeBannerBackground, 5000);
    }
    banner?.style.setProperty('--banner-opacity-layer1', '1');
    banner?.style.setProperty('--banner-opacity-layer2', '0');

    // --- First Time Setup Logic ---
    function handleFirstTimeSetup() {
        // (No changes needed here based on the issues)
        if (!firstTimeModal || !setupLangButtons || !setupThemeButtons || !confirmSetupBtn) {
             console.error("First time setup modal elements not found.");
             return false;
        }
        const setupDone = localStorage.getItem('mineWallpapersSetupDone') === 'true';
        if (setupDone) return false;

        firstTimeModal.style.display = "flex";
        document.body.classList.add('modal-open');
        setupLangButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.lang === setupLanguageChoice));
        setupThemeButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.theme === setupThemeChoice));
        setupLangButtons.forEach(button => {
            button.addEventListener('click', () => {
                setupLanguageChoice = button.dataset.lang;
                setupLangButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });
        setupThemeButtons.forEach(button => {
            button.addEventListener('click', () => {
                setupThemeChoice = button.dataset.theme;
                setupThemeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });
        confirmSetupBtn.addEventListener('click', () => {
            currentLanguage = setupLanguageChoice;
            localStorage.setItem('mineWallpapersLang', currentLanguage);
            setTheme(setupThemeChoice);
            localStorage.setItem('mineWallpapersSetupDone', 'true');
            firstTimeModal.style.display = "none";
            document.body.classList.remove('modal-open');
            initializePageContent(); // Initialize *after* setup confirmation
        });
        return true;
    }

    // --- Event Listeners ---
    categorySelect?.addEventListener('change', filterAndSearchWallpapers);
    searchInput?.addEventListener('input', filterAndSearchWallpapers);

    // Random Wallpaper Button Listener (Checked)
    randomWallpaperBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Random button clicked. Pool size:", randomizableWallpaperIds.length); // Debug log
        if (randomizableWallpaperIds.length === 0) {
            if (filteredWallpapers.length > 0) {
                alert(getInterfaceTranslation('allWallpapersRandomized', currentLanguage));
            } else {
                 alert(getInterfaceTranslation('noResults', currentLanguage));
            }
        } else {
            const randomIndex = Math.floor(Math.random() * randomizableWallpaperIds.length);
            const wallpaperId = randomizableWallpaperIds[randomIndex];
            console.log(`Randomizing... Chosen index: ${randomIndex}, ID: ${wallpaperId}`); // Debug log
            openPreviewModal(wallpaperId);
            // Remove the chosen ID from the pool for next time
            randomizableWallpaperIds.splice(randomIndex, 1);
            console.log(`ID ${wallpaperId} removed from pool. New pool size: ${randomizableWallpaperIds.length}`); // Debug log
        }
        randomWallpaperBtn.blur();
    });
    if (randomWallpaperBtn) { randomWallpaperBtn.classList.add('icon-button'); if (!randomWallpaperBtn.querySelector('i.fa-dice')) { randomWallpaperBtn.innerHTML = '<i class="fas fa-dice"></i>'; } }

    // Publish Button Listener
    publishBtn?.addEventListener('click', () => {
        const url = currentLanguage === 'pl'
            ? 'https://forms.gle/bMWDted25PYNMuPT9'
            : 'https://forms.gle/eAzL1uLp7R3zV1C88';
        window.open(url, '_blank');
        publishBtn.blur();
    });

    // Language Button Listener
    languageBtn?.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        localStorage.setItem('mineWallpapersLang', currentLanguage);
        updateStaticTexts(currentLanguage); // Update all text
        populateCategories(currentLanguage); // Repopulate dropdown
        filterAndSearchWallpapers(); // Re-filter and display using new language data
        languageBtn.blur();
    });

    // Modal listeners (Checked)
    closeModalBtn?.addEventListener('click', closePreviewModal);
    modal?.addEventListener('click', (event) => { if (event.target === modal) closePreviewModal(); }); // Close on backdrop click
    document.addEventListener('keydown', (event) => { if (event.key === "Escape" && modal?.style.display === "flex") closePreviewModal(); });
    modalDownloadButton?.addEventListener('click', () => {
        if (currentModalWallpaperData?.base?.download_page_url) {
            window.open(currentModalWallpaperData.base.download_page_url, '_blank');
        } else {
            console.error("Missing download page URL for modal wallpaper.");
            alert(getInterfaceTranslation('downloadFailed', currentLanguage) || 'Download failed.');
        }
        modalDownloadButton.blur();
    });

    // Theme Toggle Button Listener
    themeToggleButton?.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('mineWallpapersTheme') || 'system';
        const currentIndex = themeOrder.indexOf(currentTheme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
        setTheme(nextTheme);
        themeToggleButton.blur();
    });

    // System Theme Change Listener
    try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => { const currentThemeSetting = localStorage.getItem('mineWallpapersTheme') || 'system'; if (currentThemeSetting === 'system') { applyTheme('system'); updateThemeButton('system'); } };
        if (mediaQuery.addEventListener) { mediaQuery.addEventListener('change', handleChange); }
        else if (mediaQuery.addListener) { mediaQuery.addListener(handleChange); }
    } catch(e) { console.warn("System theme change detection not fully supported."); }

    // Logo Click Listener
    logoLink?.addEventListener('click', (event) => {
        event.preventDefault();
        if(searchInput) searchInput.value = '';
        if(categorySelect) categorySelect.value = 'all';
        filterAndSearchWallpapers();
        window.scrollTo({ top: 0, behavior: 'auto' });
    });

    // Scroll To Top Button Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollToTopBtn?.classList.add('visible');
        } else {
            scrollToTopBtn?.classList.remove('visible');
        }
    });
    scrollToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Keep smooth scroll here
        scrollToTopBtn.blur();
    });


    // --- Initialization Function for Page Content ---
    function initializePageContent() {
        console.log("Initializing page content...");
        if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

        // Store the full dataset only once
         if (allWallpapersData.length === 0) {
            allWallpapersData = [...wallpapersData]; // Copy data from data.js
         }


        // Set initial theme based on storage or default
        const savedTheme = localStorage.getItem('mineWallpapersTheme') || 'system';
        setTheme(savedTheme);

        // Populate UI elements based on current language
        updateStaticTexts(currentLanguage);
        populateCategories(currentLanguage);

        // Initial filter and display (populates filteredWallpapers and random pool)
        filterAndSearchWallpapers();

        // Update dynamic counts etc. (using allWallpapersData for total count)
        if (wallpaperCountElement) {
             wallpaperCountElement.textContent = getInterfaceTranslation('bannerCount', currentLanguage, { count: allWallpapersData.length });
        }

        // Start banner slideshow
        startBannerSlideshow();

        // Hide loading screen AFTER content is setup
        if (loadingScreen) {
             setTimeout(() => {
                 loadingScreen.style.opacity = '0';
                 loadingScreen.addEventListener('transitionend', () => {
                    if (loadingScreen.parentNode) {
                         loadingScreen.parentNode.removeChild(loadingScreen);
                     }
                 }, { once: true });
             }, 250);
        }
         console.log("Page content initialization complete.");
    }

    // --- Main Execution ---
    // Check if first-time setup is needed
    const setupHandled = handleFirstTimeSetup();

    // If setup modal is NOT displayed, initialize the page immediately.
    // Otherwise, initialization will be triggered by the setup modal's confirm button.
    if (!setupHandled) {
        initializePageContent();
    } else {
         // Hide loading screen even if setup modal is shown,
         // as the basic structure is loaded. Content init happens later.
          if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.addEventListener('transitionend', () => {
                 if (loadingScreen.parentNode) {
                     loadingScreen.parentNode.removeChild(loadingScreen);
                 }
             }, { once: true });
          }
         console.log("Waiting for first-time setup completion...");
    }

}); // End DOMContentLoaded
