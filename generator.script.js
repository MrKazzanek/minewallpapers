document.addEventListener('DOMContentLoaded', () => {
    // Referencje do elementów DOM
    const form = document.getElementById('wallpaper-generator-form');
    const idInput = document.getElementById('wallpaper-id');
    const titlePlInput = document.getElementById('title-pl');
    const titleEnInput = document.getElementById('title-en');
    const authorInput = document.getElementById('author');
    const authorLinkInput = document.getElementById('author-link');
    const imageUrlInput = document.getElementById('image-url');
    const downloadUrlInput = document.getElementById('download-page-url');
    const descPlInput = document.getElementById('description-pl');
    const descEnInput = document.getElementById('description-en');
    const categorySelect = document.getElementById('category-key');
    const isNewCheckbox = document.getElementById('is-new-wallpaper');
    const clearBtn = document.getElementById('clear-btn');
    const outputArea = document.getElementById('output-area');
    const codeDataOutput = document.getElementById('code-data');
    const codeTransPlOutput = document.getElementById('code-translations-pl');
    const codeTransEnOutput = document.getElementById('code-translations-en');
    const copyBtns = document.querySelectorAll('.copy-btn');

    const localStorageKey = 'mineWallpapersLastId';

    const availableCategories = {
        landscapes: "Krajobrazy", builds: "Budowle", updates: "Aktualizacje",
        structures: "Struktury", dungeons: "Minecraft Dungeons", legends: "Minecraft Legends",
        movie: "Film Minecraft", mods: "Modyfikacje", vibrant: "Vibrant Visuals",other: "Inne"
    };

    // --- Inicjalizacja ---

    function populateGeneratorCategories() {
        if (!categorySelect) {
            console.error("Element select kategorii nie został znaleziony!");
            return;
        }
        // Usuń wszystkie opcje poza pierwszą (disabled selected)
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        for (const key in availableCategories) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = availableCategories[key];
            categorySelect.appendChild(option);
        }
    }

    function loadNextId() {
        if (!idInput) return;
        const lastId = parseInt(localStorage.getItem(localStorageKey) || '0', 10);
        idInput.value = lastId + 1;
    }

    function saveNextId(currentId) {
        localStorage.setItem(localStorageKey, currentId);
    }

    // --- Obsługa formularza ---

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Pobierz wartości
            const id = idInput.value.trim();
            const titlePl = titlePlInput.value.trim();
            const titleEn = titleEnInput.value.trim();
            const author = authorInput.value.trim();
            const authorLink = authorLinkInput.value.trim();
            const imageUrl = imageUrlInput.value.trim();
            const downloadUrl = downloadUrlInput.value.trim();
            const descPl = descPlInput.value.trim();
            const descEn = descEnInput.value.trim();
            // Pobierz wybrane kategorie (teraz może być wiele)
            const selectedCategories = Array.from(categorySelect.selectedOptions).map(option => option.value);

            // === DEBUGGING: Wypisz wybrane kategorie do konsoli ===
            console.log('Selected categories:', selectedCategories);
            // ===================================================

            const isNew = isNewCheckbox ? isNewCheckbox.checked : true;

            // Walidacja
            if (!id || !titlePl || !titleEn || !author || !imageUrl || !downloadUrl || selectedCategories.length === 0) {
                alert('Proszę wypełnić wszystkie wymagane pola (ID, Nazwy, Autor, URL Obrazu, URL Pobierania, Kategoria/Kategorie).');
                return;
            }
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                 alert('ID musi być liczbą dodatnią.');
                 return;
             }
            if (!isValidUrl(imageUrl) || !isValidUrl(downloadUrl)) {
                 alert('Proszę podać poprawne adresy URL dla obrazu i strony pobierania (np. https://... lub images/...).');
                 return;
            }
            // Walidacja URL Autora (jeśli podano)
            if (authorLink && !isValidUrl(authorLink)) {
                alert('Proszę podać poprawny adres URL dla linku autora (np. https://...).');
                return;
            }

            // Generuj kod (przekazujemy authorLink i selectedCategories)
            generateCodeSnippets(id, titlePl, titleEn, author, authorLink, imageUrl, downloadUrl, descPl, descEn, selectedCategories, isNew);

            saveNextId(id);
            idInput.value = parsedId + 1;

            if (outputArea) {
                 outputArea.style.display = 'block';
                 outputArea.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (titlePlInput) titlePlInput.value = '';
            if (titleEnInput) titleEnInput.value = '';
            if (authorInput) authorInput.value = '';
            if (authorLinkInput) authorLinkInput.value = '';
            if (imageUrlInput) imageUrlInput.value = '';
            if (downloadUrlInput) downloadUrlInput.value = '';
            if (descPlInput) descPlInput.value = '';
            if (descEnInput) descEnInput.value = '';
            // Wyczyść wybrane kategorie
            if (categorySelect) {
                Array.from(categorySelect.options).forEach(option => option.selected = false);
                categorySelect.options[0].selected = true; // Ustaw domyślną pustą opcję jako wybraną
            }
            if (isNewCheckbox) isNewCheckbox.checked = true;
            if (outputArea) outputArea.style.display = 'none';
            if (codeDataOutput) codeDataOutput.textContent = '';
            if (codeTransPlOutput) codeTransPlOutput.textContent = '';
            if (codeTransEnOutput) codeTransEnOutput.textContent = '';
        });
    }

     // --- Prosta Walidacja URL ---
     function isValidUrl(string) {
        if (!string) return false;
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            if (string.includes('/') && string.includes('.') && !/\s/.test(string)) {
                 if (string.startsWith('images/')) return true;
                 if (!string.includes('/')) return true;
            }
            if (string.includes('ibb.co') || string.includes('mediafire.com')) return true;
            return false;
        }
      }

    // --- Generowanie kodu ---
    function escapeJsString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }

    // Dodano parametr authorLink i zmieniono categoryKey na selectedCategories (tablica)
    function generateCodeSnippets(id, titlePl, titleEn, author, authorLink, imageUrl, downloadUrl, descPl, descEn, selectedCategories, isNew) {
        const safeAuthor = escapeJsString(author);
        const safeAuthorLink = escapeJsString(authorLink);
        const safeTitlePl = escapeJsString(titlePl);
        const safeTitleEn = escapeJsString(titleEn);
        const safeDescPl = escapeJsString(descPl);
        const safeDescEn = escapeJsString(descEn);
        const safeImageUrl = escapeJsString(imageUrl);
        const safeDownloadUrl = escapeJsString(downloadUrl);

        // Automatyczne tworzenie nazwy miniaturki
        let thumbnailUrl = safeImageUrl;
        const lastDotIndex = safeImageUrl.lastIndexOf('.');
        const lastSlashIndex = safeImageUrl.lastIndexOf('/');
        if (lastDotIndex > 0 && lastDotIndex > lastSlashIndex) {
            const nameWithoutExt = safeImageUrl.substring(0, lastDotIndex);
            const ext = safeImageUrl.substring(lastDotIndex);
            thumbnailUrl = nameWithoutExt + '_thumb' + ext;
        } else {
             console.warn("Nie udało się znaleźć rozszerzenia w URL obrazu lub URL jest nieprawidłowy. Nie można wygenerować URL miniaturki. Użyto pełnego URL. Proszę ręcznie sprawdzić 'image_thumb'.");
             thumbnailUrl = safeImageUrl;
        }

        // 1. Kod dla data.js (zmodyfikowany o author_link i is_new)
        let dataCode = `{
    id: ${id},
    author: "${safeAuthor}",`;

        if (safeAuthorLink) {
            dataCode += `
    author_link: "${safeAuthorLink}",`;
        }

        dataCode += `
    image_thumb: "${thumbnailUrl}", // Sprawdź, czy ta ścieżka jest poprawna!
    image_full: "${safeImageUrl}",
    download_page_url: "${safeDownloadUrl}"`;

        if (isNew) {
            dataCode += `,
    is_new: true`;
        }

        dataCode += `
  },`;

        // Utwórz sformatowaną listę kategorii dla translations.js
        const categoriesArrayString = selectedCategories.map(cat => `"${escapeJsString(cat)}"`).join(', ');

        // 2. Kod dla translations.js (PL) (zmieniono category_key na category_keys jako tablicę)
        let transPlCode = `    ${id}: { title: "${safeTitlePl}",`;
        if (safeDescPl) { transPlCode += ` description: "${safeDescPl}",`; }
        transPlCode += ` category_keys: [${categoriesArrayString}] },`;

        // 3. Kod dla translations.js (EN) (zmieniono category_key na category_keys jako tablicę)
        let transEnCode = `    ${id}: { title: "${safeTitleEn}",`;
        if (safeDescEn) { transEnCode += ` description: "${safeDescEn}",`; }
        transEnCode += ` category_keys: [${categoriesArrayString}] },`;

        if (codeDataOutput) codeDataOutput.textContent = dataCode;
        if (codeTransPlOutput) codeTransPlOutput.textContent = transPlCode;
        if (codeTransEnOutput) codeTransEnOutput.textContent = transEnCode;
    }

    // --- Kopiowanie do schowka ---
    copyBtns.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const codeElement = document.getElementById(targetId);
            if (codeElement && navigator.clipboard) {
                const codeToCopy = codeElement.textContent;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    const originalText = button.textContent;
                    button.textContent = 'Skopiowano!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove('copied');
                    }, 1500);
                }).catch(err => {
                    console.error('Błąd kopiowania do schowka: ', err);
                    alert('Nie udało się skopiować do schowka. Spróbuj ręcznie.');
                });
            } else if (codeElement) {
                // Fallback dla starszych przeglądarek
                try {
                    const range = document.createRange();
                    range.selectNode(codeElement);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                    const originalText = button.textContent;
                    button.textContent = 'Skopiowano!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove('copied');
                    }, 1500);
                } catch (err) {
                    console.error('Fallback kopiowania nie powiódł się: ', err);
                    alert('Nie udało się skopiować do schowka. Spróbuj ręcznie.');
                }
            }
        });
    });

    // Uruchom inicjalizację
    populateGeneratorCategories();
    loadNextId();
});
