// quaui.js
(function() {
    const cssStyles = `
        /* === QuaUI: Podstawowe Ustawienia Komponentów === */
        .QuaUI-Button-1, .QuaUI-Button-2, .QuaUI-Card,
        .QuaUI-Card-Title, .QuaUI-Card-Text {
            box-sizing: border-box; /* Kluczowe dla spójnego layoutu */
            -webkit-font-smoothing: antialiased; /* Wygładzanie czcionek na WebKit (Chrome, Safari) */
            -moz-osx-font-smoothing: grayscale; /* Wygładzanie czcionek na Firefox */
            /* Nowoczesny, czytelny stos czcionek systemowych */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        /* === QuaUI: Komponenty === */

        /* --- Przycisk Główny (Primary) - QuaUI-Button-1 --- */
        .QuaUI-Button-1 {
            background-color: #007AFF; /* Nowoczesny niebieski (iOS-like) */
            color: white;
            border: none;
            padding: 12px 26px; /* Zwiększony padding dla lepszego wyglądu */
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 500; /* Medium weight dla lepszej czytelności */
            margin: 8px 4px;
            cursor: pointer;
            border-radius: 10px; /* Bardziej zaokrąglone rogi */
            transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.15s ease-in-out;
            box-shadow: 0 2px 5px rgba(0, 122, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.08); /* Subtelny, kolorowy cień */
            letter-spacing: 0.5px; /* Lekki odstęp między literami */
        }

        .QuaUI-Button-1:hover {
            background-color: #006EE6; /* Lekko ciemniejszy niebieski */
            box-shadow: 0 4px 10px rgba(0, 122, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1); /* Wyraźniejszy cień */
            transform: translateY(-1px); /* Lekkie uniesienie */
        }

        .QuaUI-Button-1:active {
            background-color: #005CB8; /* Najciemniejszy niebieski */
            transform: translateY(0.5px) scale(0.98); /* Efekt wciśnięcia */
            box-shadow: 0 1px 2px rgba(0, 122, 255, 0.15);
        }

        .QuaUI-Button-1:focus-visible { /* Dostępność: wyraźny focus dla nawigacji klawiaturą */
            outline: 2px solid #58AFFF;
            outline-offset: 2px;
        }

        /* --- Przycisk Akcentowy (Accent/Success) - QuaUI-Button-2 --- */
        .QuaUI-Button-2 {
            background-color: #34C759; /* Nowoczesny zielony (iOS-like success) */
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
            /* Delikatna ramka, prawie niewidoczna, ale dodaje definicji */
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px; /* Wyraźnie zaokrąglone rogi dla nowoczesnego wyglądu */
            padding: 28px; /* Więcej przestrzeni wewnątrz karty */
            margin: 24px 0; /* Większy margines zewnętrzny */
            /* Bardziej rozproszony i subtelny cień */
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
            transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            overflow: hidden; /* Zapobiega "wylewaniu się" treści, np. obrazków */
        }

        .QuaUI-Card:hover {
            transform: translateY(-4px); /* Wyraźniejsze uniesienie karty */
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .QuaUI-Card-Title {
            font-size: 22px; /* Większy, czytelny tytuł */
            font-weight: 600; /* Semi-bold dla ważności */
            color: #1D1D1F; /* Ciemny, prawie czarny tekst (Apple-like) */
            margin-top: 0;
            margin-bottom: 14px; /* Odstęp pod tytułem */
        }

        .QuaUI-Card-Text {
            font-size: 16px;
            color: #555555; /* Ciemnoszary, czytelny tekst */
            line-height: 1.7; /* Zwiększona interlinia dla lepszej czytelności dłuższych tekstów */
            margin-bottom: 20px; /* Odstęp pod głównym tekstem, przed akcjami */
        }

        /* Dodatkowe style dla przycisków wewnątrz karty */
        .QuaUI-Card > .QuaUI-Button-1,
        .QuaUI-Card > .QuaUI-Button-2,
        .QuaUI-Card > button[class*="QuaUI-Button"] { /* Działa dla każdego przycisku z klasą QuaUI-Button */
            margin-top: 10px; /* Odstęp od tekstu powyżej */
            margin-right: 10px; /* Odstęp między przyciskami obok siebie */
        }
        /* Usuń margines dolny ostatniego elementu w karcie, aby uniknąć podwójnego marginesu */
        .QuaUI-Card > *:last-child {
             margin-bottom: 0;
        }
        /* Upewnij się, że przyciski jako ostatnie elementy nie mają nadmiernego marginesu */
        .QuaUI-Card > .QuaUI-Button-1:last-child,
        .QuaUI-Card > .QuaUI-Button-2:last-child,
        .QuaUI-Card > button[class*="QuaUI-Button"]:last-child {
             margin-bottom: 0;
        }

        /* Możesz tu dodawać style dla kolejnych komponentów QuaUI */
    `;

    // Reszta kodu JavaScript (tworzenie elementu <style> i dodawanie do <head>) pozostaje taka sama:
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    if (styleElement.styleSheet) {
        // Dla starszych wersji IE
        styleElement.styleSheet.cssText = cssStyles;
    } else {
        // Dla nowoczesnych przeglądarek
        styleElement.appendChild(document.createTextNode(cssStyles));
    }

    // Dodawanie elementu <style> do <head> dokumentu
    // Najbezpieczniej jest dodać, gdy DOM jest gotowy, lub od razu, jeśli skrypt jest w <head>
    if (document.head) {
        document.head.appendChild(styleElement);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.head) { // Sprawdzenie na wszelki wypadek
                document.head.appendChild(styleElement);
            }
        });
    }
})();
