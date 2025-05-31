document.addEventListener('DOMContentLoaded', () => {
    // Referencje do elementów DOM
    const form = document.getElementById('wallpaper-generator-form');
    const idInput = document.getElementById('wallpaper-id');
    const titlePlInput = document.getElementById('title-pl');
    const titleEnInput = document.getElementById('title-en');
    const authorInput = document.getElementById('author');
    const imageUrlInput = document.getElementById('image-url');
    const downloadUrlInput = document.getElementById('download-page-url');
    const descPlInput = document.getElementById('description-pl');
    const descEnInput = document.getElementById('description-en');
    const categorySelect = document.getElementById('category-key');
    const isNewCheckbox = document.getElementById('is-new-wallpaper'); // NOWE
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
            const imageUrl = imageUrlInput.value.trim();
            const downloadUrl = downloadUrlInput.value.trim();
            const descPl = descPlInput.value.trim();
            const descEn = descEnInput.value.trim();
            const categoryKey = categorySelect.value;
            const isNew = isNewCheckbox ? isNewCheckbox.checked : true; // Odczytaj stan checkboxa (domyślnie true jeśli nie istnieje)

            // Walidacja
            if (!id || !titlePl || !titleEn || !author || !imageUrl || !downloadUrl || !categoryKey) {
                alert('Proszę wypełnić wszystkie wymagane pola (ID, Nazwy, Autor, URL Obrazu, URL Pobierania, Kategoria).');
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

            // Generuj kod (przekazujemy isNew)
            generateCodeSnippets(id, titlePl, titleEn, author, imageUrl, downloadUrl, descPl, descEn, categoryKey, isNew);

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
            if (imageUrlInput) imageUrlInput.value = '';
            if (downloadUrlInput) downloadUrlInput.value = '';
            if (descPlInput) descPlInput.value = '';
            if (descEnInput) descEnInput.value = '';
            if (categorySelect) categorySelect.value = '';
            if (isNewCheckbox) isNewCheckbox.checked = true; // NOWE: Resetuj checkbox do stanu checked
            if (outputArea) outputArea.style.display = 'none';
            if (codeDataOutput) codeDataOutput.textContent = '';
            if (codeTransPlOutput) codeTransPlOutput.textContent = '';
            if (codeTransEnOutput) codeTransEnOutput.textContent = '';
        });
    }

     // --- Prosta Walidacja URL ---
     function isValidUrl(string) {
        if (!string) return false;
        if (string.startsWith('http://') || string.startsWith('https://')) {
             try { new URL(string); return true; } catch (_) { return false; }
        }
        // Akceptuj ścieżki które wydają się URL-ami względnymi (bardzo proste)
        if (string.includes('/') && string.includes('.') && !/\s/.test(string) && !string.startsWith('/') && !string.startsWith('.')) {
             // Proste heurystyczne sprawdzenie dla względnych URL obrazów np. 'images/img.png'
             // Można to ulepszyć sprawdzając rozszerzenia itp.
             // UWAGA: To nie jest pełna walidacja URL względnego.
             // Jeśli zaczyna się od 'images/' jest OK
             if(string.startsWith('images/')) return true;
             // Akceptuje też jeśli jest tylko nazwa pliku z rozszerzeniem
             if (!string.includes('/')) return true;
        }
        // Akceptuj URL z ibb.co
        if (string.includes('ibb.co')) return true;
        // Akceptuj URL z mediafire.com
        if (string.includes('mediafire.com')) return true;

        return false;
      }

    // --- Generowanie kodu ---
    function escapeJsString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }

    // Dodano parametr isNew
    function generateCodeSnippets(id, titlePl, titleEn, author, imageUrl, downloadUrl, descPl, descEn, categoryKey, isNew) {
        const safeAuthor = escapeJsString(author);
        const safeTitlePl = escapeJsString(titlePl);
        const safeTitleEn = escapeJsString(titleEn);
        const safeDescPl = escapeJsString(descPl);
        const safeDescEn = escapeJsString(descEn);
        const safeImageUrl = escapeJsString(imageUrl);
        const safeDownloadUrl = escapeJsString(downloadUrl);

        // Automatyczne tworzenie nazwy miniaturki
        let thumbnailUrl = safeImageUrl;
        const lastDotIndex = safeImageUrl.lastIndexOf('.');
        if (lastDotIndex > 0) {
            const nameWithoutExt = safeImageUrl.substring(0, lastDotIndex);
            const ext = safeImageUrl.substring(lastDotIndex);
             // Proste zastąpienie '.png' -> '_thumb.png' itp. działa dla URL z ibb np.
             thumbnailUrl = nameWithoutExt + '_thumb' + ext;

            // Jeśli URL nie zawiera nazwy pliku (np. tylko domena), loguj ostrzeżenie
             if (thumbnailUrl === safeImageUrl || !safeImageUrl.includes('/')) {
                 console.warn("Nie udało się automatycznie wygenerować URL miniaturki, użyto pełnego URL obrazu. Edytuj ręcznie w 'data.js', jeśli potrzebujesz innej miniaturki (np. dodaj '_thumb' przed rozszerzeniem).");
                 thumbnailUrl = safeImageUrl; // Wróć do oryginalnego URL jeśli coś poszło nie tak
            }
        } else {
             console.warn("Nie udało się znaleźć rozszerzenia w URL obrazu. Nie można wygenerować URL miniaturki. Użyto pełnego URL.");
        }


        // 1. Kod dla data.js (zmodyfikowany)
        let dataCode = `{
    id: ${id},
    author: "${safeAuthor}",
    image_thumb: "${thumbnailUrl}", // Sprawdź, czy ta ścieżka jest poprawna!
    image_full: "${safeImageUrl}",
    download_page_url: "${safeDownloadUrl}"`; // Usuwamy przecinek z tej linii

        // Dodaj is_new: true jeśli checkbox jest zaznaczony
        if (isNew) {
            dataCode += `,
    is_new: true`;
        }

        dataCode += `
  },`; // Zamykający nawias i przecinek na końcu CAŁEGO obiektu

        // 2. Kod dla translations.js (PL)
        let transPlCode = `    ${id}: { title: "${safeTitlePl}",`;
        if (safeDescPl) { transPlCode += ` description: "${safeDescPl}",`; }
        transPlCode += ` category_key: "${categoryKey}" },`;

        // 3. Kod dla translations.js (EN)
        let transEnCode = `    ${id}: { title: "${safeTitleEn}",`;
        if (safeDescEn) { transEnCode += ` description: "${safeDescEn}",`; }
        transEnCode += ` category_key: "${categoryKey}" },`;

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
                // Fallback
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
