document.addEventListener('DOMContentLoaded', () => {
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
    const categoryCountDisplay = document.getElementById('category-count-display');

    // --- Preview Modal Elements ---
    const modal = document.getElementById('image-preview-modal');
    const modalImg = document.getElementById('preview-image');
    const modalDownloadButton = document.getElementById('preview-download-button');
    const closeModalBtn = document.querySelector('#image-preview-modal .close-btn');
    const modalTitle = document.getElementById('modal-wallpaper-title');
    const modalAuthor = document.getElementById('modal-wallpaper-author');
    const modalCategories = document.getElementById('modal-wallpaper-categories');
    const modalDescription = document.getElementById('modal-wallpaper-description');

    // --- Slideshow Elements ---
    const slideshowBtn = document.getElementById('slideshow-btn');
    const slideshowModal = document.getElementById('slideshow-modal');
    const slideshowImage = document.getElementById('slideshow-image');
    const slideshowProgressBar = document.querySelector('.slideshow-progress-bar');
    const slideshowCloseBtn = document.getElementById('slideshow-close-btn');
    const slideshowPausedOverlay = document.getElementById('slideshow-paused-overlay');
    const slideshowResumeBtn = document.getElementById('slideshow-resume-btn');
    const slideshowDownloadLink = document.getElementById('slideshow-download-link');
    const slideshowClosePausedBtn = document.getElementById('slideshow-close-paused-btn');
    const slideshowTitle = document.getElementById('slideshow-wallpaper-title');
    const slideshowAuthor = document.getElementById('slideshow-wallpaper-author');
    const slideshowCategories = document.getElementById('slideshow-wallpaper-categories');
    const slideshowDescription = document.getElementById('slideshow-wallpaper-description');

    // --- First Time Setup Elements ---
    const firstTimeModal = document.getElementById('first-time-modal');
    const setupLangButtons = firstTimeModal?.querySelectorAll('.button-group button[data-lang]');
    const setupThemeButtons = firstTimeModal?.querySelectorAll('.button-group button[data-theme]');
    const confirmSetupBtn = document.getElementById('confirm-setup-btn');

    // --- State ---
    let currentLanguage = localStorage.getItem('mineWallpapersLang') || 'pl';
    let allWallpapersData = [];
    let filteredWallpapers = [];
    let randomizableWallpaperIds = [];
    const themeOrder = ['system', 'light', 'dark'];
    let bannerInterval;
    let currentModalWallpaperData = null;

    // --- Slideshow State ---
    let slideshowWallpapers = [];
    let slideshowCurrentIndex = 0;
    let slideshowInterval;
    let isSlideshowPaused = false;
    const SLIDESHOW_DELAY = 5000;

    // --- Content Protection ---
    document.body.oncontextmenu = (e) => { e.preventDefault(); return false; };
    document.addEventListener('dragstart', (event) => {
        if (event.target.tagName === 'IMG') { event.preventDefault(); }
    });

    // --- Helper Functions ---
    function getInterfaceTranslation(key, lang = currentLanguage, replacements = {}) {
        const keys = key.split('.');
        let text = interfaceTranslations[lang] || {};
        try {
            keys.forEach(k => { text = text[k]; });
            if (text === undefined) { throw new Error(`Translation key not found: ${key}`); }
        } catch (e) { text = key; }
        text = text || key;
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

    function getCategoryName(categoryKey, lang = currentLanguage) {
        return categoryDefinitions[categoryKey]?.[lang] || categoryKey;
    }

    function getWallpaperTextData(wallpaperId, lang = currentLanguage) {
        const baseData = allWallpapersData.find(w => w.id === wallpaperId);
        if (!baseData) return {};
        return wallpaperContentTranslations[lang]?.[wallpaperId] || {};
    }

    // --- Modal Functions ---
    function openPreviewModal(wallpaperId) {
        const wallpaperBase = allWallpapersData.find(w => w.id === wallpaperId);
        const wallpaperText = getWallpaperTextData(wallpaperId, currentLanguage);
        if (!wallpaperBase || !modal) return;
        currentModalWallpaperData = { base: wallpaperBase, text: wallpaperText };
        modalImg.src = wallpaperBase.image_full;
        modalImg.alt = getInterfaceTranslation('previewAlt', currentLanguage, { title: wallpaperText.title || `Wallpaper ${wallpaperId}` });
        modalTitle.textContent = wallpaperText.title || `Wallpaper ${wallpaperId}`;
        
        // MODIFIED: Added author_link handling for modal
        const modalAuthorContent = wallpaperBase.author_link ?
            `<a href="${wallpaperBase.author_link}" target="_self" rel="noopener noreferrer">${wallpaperBase.author || 'N/A'}</a>` :
            (wallpaperBase.author || 'N/A');
        modalAuthor.innerHTML = `<strong>${getInterfaceTranslation('authorLabel', currentLanguage)}:</strong> ${modalAuthorContent}`;

        const categoryKeys = wallpaperText.category_keys;
        if (categoryKeys && categoryKeys.length > 0) {
            const categoryNames = categoryKeys.map(key => getCategoryName(key, currentLanguage)).join(', ');
            modalCategories.innerHTML = `<strong>${getInterfaceTranslation('categoriesLabel', currentLanguage)}:</strong> ${categoryNames}`;
            modalCategories.style.display = 'block';
        } else {
            modalCategories.style.display = 'none';
        }
        modalDescription.textContent = wallpaperText.description || '';
        modal.style.display = "flex";
        document.body.classList.add('modal-open');
    }

    function closePreviewModal() {
        if (!modal) return;
        modal.style.display = "none";
        if (slideshowModal.style.display !== 'flex') {
            document.body.classList.remove('modal-open');
        }
    }
    
    // --- Slideshow Functions ---
    function showSlide(index) {
        if (index >= slideshowWallpapers.length) {
            stopSlideshow();
            return;
        }
        const wallpaper = slideshowWallpapers[index];
        slideshowImage.style.opacity = 0;
        const tempImg = new Image();
        tempImg.src = wallpaper.image_full;
        tempImg.onload = () => {
            slideshowImage.src = tempImg.src;
            slideshowImage.style.opacity = 1;
        };
        const progress = ((index + 1) / slideshowWallpapers.length) * 100;
        slideshowProgressBar.style.width = `${progress}%`;
    }

    function startSlideshow() {
        if (filteredWallpapers.length === 0) {
            alert(getInterfaceTranslation('noResults', currentLanguage));
            return;
        }
        slideshowWallpapers = [...filteredWallpapers];
        slideshowCurrentIndex = 0;
        isSlideshowPaused = false;
        
        slideshowModal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        showSlide(slideshowCurrentIndex);

        slideshowInterval = setInterval(() => {
            slideshowCurrentIndex++;
            showSlide(slideshowCurrentIndex);
        }, SLIDESHOW_DELAY);
    }
    
    function stopSlideshow() {
        clearInterval(slideshowInterval);
        slideshowModal.style.display = 'none';
        slideshowPausedOverlay.classList.remove('visible');
        if (modal.style.display !== 'flex') {
             document.body.classList.remove('modal-open');
        }
    }
    
    function pauseSlideshow() {
        if (isSlideshowPaused) return;
        isSlideshowPaused = true;
        clearInterval(slideshowInterval);

        const wallpaperBase = slideshowWallpapers[slideshowCurrentIndex];
        const wallpaperText = getWallpaperTextData(wallpaperBase.id, currentLanguage);

        slideshowTitle.textContent = wallpaperText.title || `Wallpaper ${wallpaperBase.id}`;
        
        // MODIFIED: Added author_link handling for slideshow pause
        const slideshowAuthorContent = wallpaperBase.author_link ?
            `<a href="${wallpaperBase.author_link}" target="_blank" rel="noopener noreferrer">${wallpaperBase.author || 'N/A'}</a>` :
            (wallpaperBase.author || 'N/A');
        slideshowAuthor.innerHTML = `<strong>${getInterfaceTranslation('authorLabel', currentLanguage)}:</strong> ${slideshowAuthorContent}`;

        const categoryKeys = wallpaperText.category_keys;
        if (categoryKeys && categoryKeys.length > 0) {
            slideshowCategories.innerHTML = `<strong>${getInterfaceTranslation('categoriesLabel', currentLanguage)}:</strong> ${categoryKeys.map(key => getCategoryName(key, currentLanguage)).join(', ')}`;
        } else {
            slideshowCategories.innerHTML = '';
        }
        slideshowDescription.textContent = wallpaperText.description || '';
        slideshowDownloadLink.href = wallpaperBase.download_page_url || '#';
        
        slideshowPausedOverlay.style.display = 'flex';
        setTimeout(() => slideshowPausedOverlay.classList.add('visible'), 10);
    }

    function resumeSlideshow() {
        isSlideshowPaused = false;
        slideshowPausedOverlay.classList.remove('visible');
        setTimeout(() => { 
            slideshowPausedOverlay.style.display = 'none' 
        }, 300);
        
        slideshowInterval = setInterval(() => {
            slideshowCurrentIndex++;
            showSlide(slideshowCurrentIndex);
        }, SLIDESHOW_DELAY);
    }
    
    // --- UI Update & Filter Functions ---
    function updateStaticTexts(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => el.innerHTML = getInterfaceTranslation(el.getAttribute('data-translate'), lang));
        document.querySelectorAll('[data-translate-count]').forEach(el => el.textContent = getInterfaceTranslation(el.getAttribute('data-translate-count'), lang, { count: allWallpapersData.length }));
        document.querySelectorAll('[data-translate-lang]').forEach(el => el.textContent = getInterfaceTranslation(el.getAttribute('data-translate-lang'), lang));
        document.querySelectorAll('[data-translate-title]').forEach(el => el.title = getInterfaceTranslation(el.getAttribute('data-translate-title'), lang));
        document.querySelectorAll('[data-translate-aria]').forEach(el => el.setAttribute('aria-label', getInterfaceTranslation(el.getAttribute('data-translate-aria'), lang)));
        if (searchInput) searchInput.placeholder = getInterfaceTranslation('searchPlaceholder', lang);
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
        categorySelect.value = categoryDefinitions[currentCategoryValue] || currentCategoryValue === 'all' ? currentCategoryValue : 'all';
    }
    
    function displayWallpapers(wallpapersToDisplay) {
        if (!wallpaperGrid) return;
        wallpaperGrid.innerHTML = '';
        if (wallpapersToDisplay.length === 0) {
            wallpaperGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${getInterfaceTranslation('noResults', currentLanguage)}</p>`;
            return;
        }
        const currentCategoryFilterKey = categorySelect ? categorySelect.value : 'all';
        const showCategoryTags = currentCategoryFilterKey === 'all';
        const fragment = document.createDocumentFragment();
        wallpapersToDisplay.forEach(wallpaper => {
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            const wallpaperItem = document.createElement('div');
            wallpaperItem.className = 'wallpaper-item';
            let categoryTagsHTML = '';
            if (showCategoryTags && textData.category_keys?.length > 0) {
                 const tags = textData.category_keys.map(key => `<a href="#" class="category-tag" data-category-key="${key}">${getCategoryName(key, currentLanguage)}</a>`).join('');
                categoryTagsHTML = `<div class="category-tags-container">${tags}</div>`;
            }

            // MODIFIED: Added author_link handling for general wallpaper display
            const authorContent = wallpaper.author_link ?
                `<a href="${wallpaper.author_link}" target="_blank" rel="noopener noreferrer" class="author-link">${wallpaper.author || 'N/A'}</a>` :
                (wallpaper.author || 'N/A');

            wallpaperItem.innerHTML = `
                <div class="wallpaper-image-container" data-wallpaper-id="${wallpaper.id}">
                    ${wallpaper.is_new ? `<span class="new-tag">${getInterfaceTranslation('newTag', currentLanguage)}</span>` : ''}
                    <img src="${wallpaper.image_thumb || ''}" alt="${textData.title || ''}" loading="lazy" draggable="false">
                </div>
                <div class="wallpaper-info">
                    <h3>${textData.title || `Wallpaper ${wallpaper.id}`}</h3>
                    <p class="author"><strong>${getInterfaceTranslation('authorLabel', currentLanguage)}:</strong> ${authorContent}</p>
                    ${textData.description ? `<p class="description">${textData.description}</p>` : ''}
                    ${categoryTagsHTML}
                    <a href="${wallpaper.download_page_url || '#'}" target="_blank" rel="noopener noreferrer" class="download-btn">${getInterfaceTranslation('downloadButton', currentLanguage)}</a>
                </div>`;
            wallpaperItem.querySelector('.wallpaper-image-container').addEventListener('click', () => openPreviewModal(wallpaper.id));
            if (showCategoryTags) {
                wallpaperItem.querySelectorAll('.category-tag').forEach(tag => {
                    tag.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (categorySelect) categorySelect.value = e.currentTarget.dataset.categoryKey;
                        filterAndSearchWallpapers();
                        document.querySelector('.filter-controls')?.scrollIntoView({ behavior: 'smooth' });
                    });
                });
            }
            fragment.appendChild(wallpaperItem);
        });
        wallpaperGrid.appendChild(fragment);
    }
    
    function filterAndSearchWallpapers() {
        const selectedCategoryKey = categorySelect ? categorySelect.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        filteredWallpapers = allWallpapersData.filter(wallpaper => {
            const textData = getWallpaperTextData(wallpaper.id, currentLanguage);
            const categoryKeys = textData.category_keys || [];
            const isCategoryMatch = selectedCategoryKey === 'all' || categoryKeys.includes(selectedCategoryKey);
            if (!isCategoryMatch) return false;
            if (searchTerm) {
                const searchCorpus = [
                    textData.title,
                    wallpaper.author,
                    textData.description,
                    ...categoryKeys.map(key => getCategoryName(key, currentLanguage))
                ].join(' ').toLowerCase();
                return searchCorpus.includes(searchTerm) || wallpaper.id.toString() === searchTerm;
            }
            return true;
        });
        displayWallpapers(filteredWallpapers);
        randomizableWallpaperIds = filteredWallpapers.map(w => w.id);
        if (categoryCountDisplay) {
            if (selectedCategoryKey === 'all') {
                categoryCountDisplay.classList.remove('visible');
            } else {
                categoryCountDisplay.textContent = getInterfaceTranslation('categoryResultCount', currentLanguage, { count: filteredWallpapers.length });
                categoryCountDisplay.classList.add('visible');
            }
        }
    }

    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        let themeToApply = theme;
        if (theme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.body.classList.add(themeToApply === 'dark' ? 'dark-theme' : 'light-theme');
    }

    function updateThemeButton(theme) {
        if (!themeToggleButton) return;
        const icon = themeToggleButton.querySelector('i');
        const labels = { system: 'themeToggleButton.system', light: 'themeToggleButton.light', dark: 'themeToggleButton.dark' };
        const icons = { system: 'fa-circle-half-stroke', light: 'fa-sun', dark: 'fa-moon' };
        icon.className = `fas ${icons[theme]}`;
        themeToggleButton.setAttribute('aria-label', getInterfaceTranslation(labels[theme], currentLanguage));
    }

    function setTheme(theme) {
         applyTheme(theme);
         localStorage.setItem('mineWallpapersTheme', theme);
         updateThemeButton(theme);
    }

    function startBannerSlideshow() {
        if (!banner) return;
        const images = JSON.parse(banner.getAttribute('data-banner-images') || '[]');
        if (images.length < 2) return;
        let currentIndex = 0;
        let isActiveLayerOne = true;
        banner.style.setProperty('--banner-bg-layer1', `url('${images[0]}')`);
        bannerInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            const nextImage = `url('${images[currentIndex]}')`;
            if (isActiveLayerOne) {
                banner.style.setProperty('--banner-bg-layer2', nextImage);
                banner.style.setProperty('--banner-opacity-layer1', '0');
                banner.style.setProperty('--banner-opacity-layer2', '1');
            } else {
                banner.style.setProperty('--banner-bg-layer1', nextImage);
                banner.style.setProperty('--banner-opacity-layer1', '1');
                banner.style.setProperty('--banner-opacity-layer2', '0');
            }
            isActiveLayerOne = !isActiveLayerOne;
        }, 5000);
    }

    function handleFirstTimeSetup() {
        if (!firstTimeModal || localStorage.getItem('mineWallpapersSetupDone') === 'true') return false;
        firstTimeModal.style.display = "flex";
        document.body.classList.add('modal-open');
        // Pozostała logika setupu
        return true;
    }

    // --- Initial Execution ---
    function initializePageContent() {
        if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
        if (allWallpapersData.length === 0) allWallpapersData = [...wallpapersData];
        setTheme(localStorage.getItem('mineWallpapersTheme') || 'system');
        updateStaticTexts(currentLanguage);
        populateCategories(currentLanguage);
        filterAndSearchWallpapers();
        startBannerSlideshow();
        if (loadingScreen) {
             setTimeout(() => {
                 loadingScreen.style.opacity = '0';
                 loadingScreen.addEventListener('transitionend', () => loadingScreen.remove(), { once: true });
             }, 250);
        }
    }

    if (!handleFirstTimeSetup()) {
        initializePageContent();
    } else {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.addEventListener('transitionend', () => loadingScreen.remove(), { once: true });
        }
    }

    // --- Event Listeners ---
    categorySelect?.addEventListener('change', filterAndSearchWallpapers);
    searchInput?.addEventListener('input', filterAndSearchWallpapers);
    
    randomWallpaperBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        
        if (randomizableWallpaperIds.length === 0 && filteredWallpapers.length > 0) {
            randomizableWallpaperIds = filteredWallpapers.map(w => w.id);
        }
        
        if (randomizableWallpaperIds.length === 0) {
            alert(getInterfaceTranslation(filteredWallpapers.length > 0 ? 'allWallpapersRandomized' : 'noResults', currentLanguage));
            return;
        }

        const randomIndex = Math.floor(Math.random() * randomizableWallpaperIds.length);
        const wallpaperId = randomizableWallpaperIds[randomIndex];
        openPreviewModal(wallpaperId);
        
        randomizableWallpaperIds.splice(randomIndex, 1);
        
        randomWallpaperBtn.blur();
    });

    slideshowBtn?.addEventListener('click', startSlideshow);
    slideshowImage?.addEventListener('click', pauseSlideshow);
    slideshowResumeBtn?.addEventListener('click', resumeSlideshow);
    [slideshowCloseBtn, slideshowClosePausedBtn].forEach(btn => btn?.addEventListener('click', stopSlideshow));
    
    publishBtn?.addEventListener('click', () => { window.open(currentLanguage === 'pl' ? 'https://forms.gle/bMWDted25PYNMuPT9' : 'https://forms.gle/eAzL1uLp7R3zV1C88', '_blank'); });
    languageBtn?.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        localStorage.setItem('mineWallpapersLang', currentLanguage);
        updateStaticTexts(currentLanguage);
        populateCategories(currentLanguage);
        filterAndSearchWallpapers();
    });
    
    closeModalBtn?.addEventListener('click', closePreviewModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closePreviewModal(); });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            if (modal?.style.display === 'flex') closePreviewModal();
            if (slideshowModal?.style.display === 'flex') stopSlideshow();
        }
    });
    
    themeToggleButton?.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('mineWallpapersTheme') || 'system';
        const nextIndex = (themeOrder.indexOf(currentTheme) + 1) % themeOrder.length;
        setTheme(themeOrder[nextIndex]);
    });
    
    logoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        if(searchInput) searchInput.value = '';
        if(categorySelect) categorySelect.value = 'all';
        filterAndSearchWallpapers();
        window.scrollTo({ top: 0, behavior: 'auto' });
    });
    
    window.addEventListener('scroll', () => {
        if(scrollToTopBtn) scrollToTopBtn.classList.toggle('visible', window.scrollY > 200);
    });
    
    scrollToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
