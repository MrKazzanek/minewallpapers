document.addEventListener('DOMContentLoaded', () => {
    // Referencje do elementów DOM
    const form = document.getElementById('wallpaper-generator-form');
    const idInput = document.getElementById('wallpaper-id');
    const titlePlInput = document.getElementById('title-pl');
    const titleEnInput = document.getElementById('title-en');
    const authorInput = document.getElementById('author');
    const imageUrlInput = document.getElementById('image-url'); // NOWE
    const downloadUrlInput = document.getElementById('download-page-url'); // NOWE
    const descPlInput = document.getElementById('description-pl');
    const descEnInput = document.getElementById('description-en');
    const categorySelect = document.getElementById('category-key');
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
        movie: "Film Minecraft", mods: "Modyfikacje", other: "Inne"
    };

    // --- Inicjalizacja ---

    // Wypełnij listę kategorii
    function populateGeneratorCategories() {
        // Upewnij się, że element select istnieje
        if (!categorySelect) {
            console.error("Element select kategorii nie został znaleziony!");
            return;
        }
        // Wyczyść istniejące opcje (oprócz pierwszej wyłączonej)
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        // Dodaj nowe opcje
        for (const key in availableCategories) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = availableCategories[key]; // Używamy nazw zdefiniowanych tutaj
            categorySelect.appendChild(option);
        }
    }


    // Wczytaj i ustaw następne ID
    function loadNextId() {
        if (!idInput) return; // Sprawdzenie
        const lastId = parseInt(localStorage.getItem(localStorageKey) || '0', 10);
        idInput.value = lastId + 1;
    }

    // Zapisz następne ID
    function saveNextId(currentId) {
        localStorage.setItem(localStorageKey, currentId);
    }

    // --- Obsługa formularza ---

    if (form) { // Sprawdź, czy formularz istnieje
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Zapobiegaj standardowemu wysłaniu formularza

            // Pobierz wartości (w tym nowe pola)
            const id = idInput.value.trim();
            const titlePl = titlePlInput.value.trim();
            const titleEn = titleEnInput.value.trim();
            const author = authorInput.value.trim();
            const imageUrl = imageUrlInput.value.trim();
            const downloadUrl = downloadUrlInput.value.trim();
            const descPl = descPlInput.value.trim();
            const descEn = descEnInput.value.trim();
            const categoryKey = categorySelect.value;

            // Walidacja (dodano sprawdzenie URL)
            if (!id || !titlePl || !titleEn || !author || !imageUrl || !downloadUrl || !categoryKey) {
                alert('Proszę wypełnić wszystkie wymagane pola (ID, Nazwy, Autor, URL Obrazu, URL Pobierania, Kategoria).');
                return;
            }
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                 alert('ID musi być liczbą dodatnią.');
                 return;
             }
            // Prosta walidacja URL
            if (!isValidUrl(imageUrl) || !isValidUrl(downloadUrl)) {
                 alert('Proszę podać poprawne adresy URL dla obrazu i strony pobierania (np. https://... lub images/...).');
                 return;
            }

            // Generuj kod (przekazujemy nowe wartości)
            generateCodeSnippets(id, titlePl, titleEn, author, imageUrl, downloadUrl, descPl, descEn, categoryKey);

            // Zapisz i ustaw następne ID
            saveNextId(id);
            idInput.value = parsedId + 1;

            // Pokaż obszar wyników
            if (outputArea) {
                 outputArea.style.display = 'block';
                 // Przewiń do wyników
                 outputArea.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (clearBtn) { // Sprawdź, czy przycisk istnieje
        clearBtn.addEventListener('click', () => {
            // Czyść wszystkie pola oprócz ID
            if (titlePlInput) titlePlInput.value = '';
            if (titleEnInput) titleEnInput.value = '';
            if (authorInput) authorInput.value = '';
            if (imageUrlInput) imageUrlInput.value = '';
            if (downloadUrlInput) downloadUrlInput.value = '';
            if (descPlInput) descPlInput.value = '';
            if (descEnInput) descEnInput.value = '';
            if (categorySelect) categorySelect.value = ''; // Resetuj select
            // Ukryj wyniki
            if (outputArea) outputArea.style.display = 'none';
            if (codeDataOutput) codeDataOutput.textContent = '';
            if (codeTransPlOutput) codeTransPlOutput.textContent = '';
            if (codeTransEnOutput) codeTransEnOutput.textContent = '';
        });
    }

     // --- Prosta Walidacja URL ---
     function isValidUrl(string) {
        if (!string) return false;
        // Akceptuj bezwzględne URL (http, https)
        if (string.startsWith('http://') || string.startsWith('https://')) {
             try {
               new URL(string);
               return true;
             } catch (_) {
               return false;
             }
        }
        // Akceptuj ścieżki względne (proste sprawdzenie - nie zaczyna się od '/', zawiera '.' i nie ma spacji)
        // Możesz dostosować tę logikę do swoich potrzeb
        if (!string.startsWith('/') && string.includes('.') && !/\s/.test(string)) {
            return true;
        }
        // Dodaj tu inne warunki, jeśli potrzebujesz (np. sprawdzanie rozszerzeń)
        return false; // Domyślnie nie jest poprawny
      }

    // --- Generowanie kodu ---

    // Pomocnicza funkcja do escape'owania stringów dla kodu JS
    function escapeJsString(str) {
        if (typeof str !== 'string') return ''; // Zwróć pusty string jeśli nie jest stringiem
        return str.replace(/\\/g, '\\\\') // Backslashes
                  .replace(/"/g, '\\"')  // Double quotes
                  .replace(/'/g, "\\'")  // Single quotes
                  .replace(/\n/g, '\\n') // Newlines
                  .replace(/\r/g, '\\r'); // Carriage returns
    }

    function generateCodeSnippets(id, titlePl, titleEn, author, imageUrl, downloadUrl, descPl, descEn, categoryKey) {
        const safeAuthor = escapeJsString(author);
        const safeTitlePl = escapeJsString(titlePl);
        const safeTitleEn = escapeJsString(titleEn);
        const safeDescPl = escapeJsString(descPl);
        const safeDescEn = escapeJsString(descEn);
        const safeImageUrl = escapeJsString(imageUrl);
        const safeDownloadUrl = escapeJsString(downloadUrl);

        // Automatyczne tworzenie nazwy miniaturki
        let thumbnailUrl = safeImageUrl; // Domyślnie ten sam URL
        const lastDotIndex = safeImageUrl.lastIndexOf('.');
        if (lastDotIndex > 0) {
            const nameWithoutExt = safeImageUrl.substring(0, lastDotIndex);
            const ext = safeImageUrl.substring(lastDotIndex);
            const lastSlashIndex = nameWithoutExt.lastIndexOf('/');
            if (lastSlashIndex !== -1) {
                 thumbnailUrl = nameWithoutExt.substring(0, lastSlashIndex + 1) +
                                nameWithoutExt.substring(lastSlashIndex + 1) + '_thumb' + ext;
            } else {
                 thumbnailUrl = nameWithoutExt + '_thumb' + ext;
            }
        }
        if (thumbnailUrl === safeImageUrl) {
            console.warn("Nie udało się automatycznie wygenerować nazwy miniaturki, użyto pełnego URL obrazu. Edytuj ręcznie w 'data.js', jeśli potrzebujesz innej miniaturki.");
        }


        // 1. Kod dla data.js
        const dataCode = `{
    id: ${id},
    author: "${safeAuthor}",
    image_thumb: "${thumbnailUrl}", // Sprawdź, czy ta ścieżka jest poprawna!
    image_full: "${safeImageUrl}",
    download_page_url: "${safeDownloadUrl}"
  },`; // Przecinek na końcu

        // 2. Kod dla translations.js (PL)
        let transPlCode = `    ${id}: { title: "${safeTitlePl}",`;
        if (safeDescPl) { transPlCode += ` description: "${safeDescPl}",`; }
        transPlCode += ` category_key: "${categoryKey}" },`;

        // 3. Kod dla translations.js (EN)
        let transEnCode = `    ${id}: { title: "${safeTitleEn}",`;
        if (safeDescEn) { transEnCode += ` description: "${safeDescEn}",`; }
        transEnCode += ` category_key: "${categoryKey}" },`;

        // Wyświetl kod (sprawdź, czy elementy istnieją)
        if (codeDataOutput) codeDataOutput.textContent = dataCode;
        if (codeTransPlOutput) codeTransPlOutput.textContent = transPlCode;
        if (codeTransEnOutput) codeTransEnOutput.textContent = transEnCode;
    }

    // --- Kopiowanie do schowka ---
    copyBtns.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const codeElement = document.getElementById(targetId);
            if (codeElement && navigator.clipboard) { // Sprawdź wsparcie dla clipboard API
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
                // Fallback dla starszych przeglądarek (mniej niezawodny)
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