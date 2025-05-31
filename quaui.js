// quaui.js
(function() {
    // -------------------------------------------------------------------------
    // 1. DEFINICJA PODSTAWOWYCH STYLÓW CSS (jak poprzednio)
    // -------------------------------------------------------------------------
    const baseCssStyles = `
        /* === QuaUI: Podstawowe Ustawienia Komponentów === */
        .QuaUI-Button-1, .QuaUI-Button-2, .QuaUI-Card,
        .QuaUI-Card-Title, .QuaUI-Card-Text {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        /* === QuaUI: Komponenty (Twoje nowoczesne style) === */

        /* --- Przycisk Główny (Primary) - QuaUI-Button-1 --- */
        .QuaUI-Button-1 {
            background-color: #007AFF;
            color: white;
            border: none;
            padding: 12px 26px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            margin: 8px 4px;
            cursor: pointer;
            border-radius: 10px;
            transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.15s ease-in-out;
            box-shadow: 0 2px 5px rgba(0, 122, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.08);
            letter-spacing: 0.5px;
        }
        .QuaUI-Button-1:hover {
            background-color: #006EE6;
            box-shadow: 0 4px 10px rgba(0, 122, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
        .QuaUI-Button-1:active {
            background-color: #005CB8;
            transform: translateY(0.5px) scale(0.98);
            box-shadow: 0 1px 2px rgba(0, 122, 255, 0.15);
        }
        .QuaUI-Button-1:focus-visible {
            outline: 2px solid #58AFFF;
            outline-offset: 2px;
        }

        /* --- Przycisk Akcentowy (Accent/Success) - QuaUI-Button-2 --- */
        .QuaUI-Button-2 {
            background-color: #34C759;
            color: white;
            border: none;
            padding: 12px 26px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            margin: 8px 4px;
            cursor: pointer;
            border-radius: 10px;
            transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.15s ease-in-out;
            box-shadow: 0 2px 5px rgba(52, 199, 89, 0.2), 0 1px 3px rgba(0, 0, 0, 0.08);
            letter-spacing: 0.5px;
        }
        .QuaUI-Button-2:hover {
            background-color: #2DB34D;
            box-shadow: 0 4px 10px rgba(52, 199, 89, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
        .QuaUI-Button-2:active {
            background-color: #269A42;
            transform: translateY(0.5px) scale(0.98);
            box-shadow: 0 1px 2px rgba(52, 199, 89, 0.15);
        }
        .QuaUI-Button-2:focus-visible {
            outline: 2px solid #70D88B;
            outline-offset: 2px;
        }

        /* --- Karta - QuaUI-Card --- */
        .QuaUI-Card {
            background-color: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            padding: 28px;
            margin: 24px 0;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
            transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            overflow: hidden;
        }
        .QuaUI-Card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(0, 0, 0, 0.06);
        }
        .QuaUI-Card-Title {
            font-size: 22px;
            font-weight: 600;
            color: #1D1D1F;
            margin-top: 0;
            margin-bottom: 14px;
        }
        .QuaUI-Card-Text {
            font-size: 16px;
            color: #555555;
            line-height: 1.7;
            margin-bottom: 20px;
        }
        .QuaUI-Card > .QuaUI-Button-1,
        .QuaUI-Card > .QuaUI-Button-2,
        .QuaUI-Card > button[class*="QuaUI-Button"] {
            margin-top: 10px;
            margin-right: 10px;
        }
        .QuaUI-Card > *:last-child {
             margin-bottom: 0;
        }
        .QuaUI-Card > .QuaUI-Button-1:last-child,
        .QuaUI-Card > .QuaUI-Button-2:last-child,
        .QuaUI-Card > button[class*="QuaUI-Button"]:last-child {
             margin-bottom: 0;
        }
    `;

    // -------------------------------------------------------------------------
    // 2. WSTRZYKIWANIE PODSTAWOWYCH STYLÓW DO <HEAD>
    // -------------------------------------------------------------------------
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = baseCssStyles;
    } else {
        styleElement.appendChild(document.createTextNode(baseCssStyles));
    }
    // Dodajemy od razu, zakładając że skrypt jest w <head> lub na końcu body z defer
    if (document.head) {
        document.head.appendChild(styleElement);
    } else {
        // Fallback, jeśli head nie jest jeszcze dostępny (mało prawdopodobne dla <script> w <head>)
        document.addEventListener('DOMContentLoaded', function() {
            if (document.head) document.head.appendChild(styleElement);
        });
    }

    // -------------------------------------------------------------------------
    // 3. LOGIKA DO OBSŁUGI ATRYBUTÓW STYLUJĄCYCH
    // -------------------------------------------------------------------------
    function applyAttributeStyles() {
        // Mapa atrybutów HTML na właściwości CSS (wersja camelCase dla element.style)
        const attributeToCssMap = {
            'bcl': 'backgroundColor',
            'cl': 'color',
            'wt': 'width',
            'ht': 'height',
            'br': 'borderRadius',
            'm': 'margin',
            'mt': 'marginTop',
            'mb': 'marginBottom',
            'ml': 'marginLeft',
            'mr': 'marginRight',
            'p': 'padding',
            'pt': 'paddingTop',
            'pb': 'paddingBottom',
            'pl': 'paddingLeft',
            'pr': 'paddingRight',
            'f': 'fontFamily',
            'fs': 'fontSize',
            // Możesz dodać więcej, np. 'fw': 'fontWeight', 'd': 'display', etc.
        };

        // Funkcja pomocnicza do dodawania 'px' jeśli wartość jest numeryczna i nie ma jednostki
        // Rozszerzona, by poprawnie obsługiwać wartości shorthand dla margin/padding
        function processValueWithUnits(value, cssProperty) {
            if (typeof value !== 'string') return value; // Jeśli nie string, zwróć bez zmian

            const needsUnitsProps = [
                'width', 'height', 'borderRadius', 'fontSize',
                'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
                'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'
            ];

            if (needsUnitsProps.includes(cssProperty)) {
                // Dla margin i padding, które mogą mieć wiele wartości (np. "10 20")
                if (cssProperty === 'margin' || cssProperty === 'padding') {
                    return value.split(/\s+/).map(part => {
                        if (String(part).match(/^[0-9.]+$/) && !isNaN(parseFloat(part))) {
                            return part + 'px';
                        }
                        return part; // Zostaw jeśli ma już jednostkę lub jest słowem kluczowym (np. auto)
                    }).join(' ');
                } else { // Dla pojedynczych wartości
                    if (String(value).match(/^[0-9.]+$/) && !isNaN(parseFloat(value))) {
                        return value + 'px';
                    }
                }
            }
            return value; // Zwróć oryginalną wartość dla kolorów, font-family itp.
        }

        // Znajdź wszystkie elementy, które potencjalnie mogą używać atrybutów QuaUI
        // Można to zawęzić do elementów z klasą QuaUI, jeśli chcesz: document.querySelectorAll('[class*="QuaUI-"]')
        // Na razie, dla prostoty, przeszukamy wszystkie elementy.
        // Lepsze podejście: tylko te z klasami QuaUI
        const elements = document.querySelectorAll('[class*="QuaUI-"]');


        elements.forEach(element => {
            for (const attrName in attributeToCssMap) {
                if (element.hasAttribute(attrName)) {
                    const cssProperty = attributeToCssMap[attrName];
                    let value = element.getAttribute(attrName);

                    value = processValueWithUnits(value, cssProperty);

                    element.style[cssProperty] = value;
                }
            }
        });
    }

    // Uruchom funkcję po załadowaniu DOM, aby mieć pewność, że wszystkie elementy są dostępne
    // Jeśli skrypt jest na końcu body, DOMContentLoaded może być zbędne, ale jest bezpieczniejsze
    if (document.readyState === 'loading') { // lub 'interactive'
        document.addEventListener('DOMContentLoaded', applyAttributeStyles);
    } else {
        // DOM jest już gotowy
        applyAttributeStyles();
    }

})();
