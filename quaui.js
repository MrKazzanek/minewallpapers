// quaui.js
(function() {
    // Definicja stylów CSS jako string
    const cssStyles = `
        /* === QuaUI: Ogólne Resetowanie (bardzo podstawowe) === */
        .QuaUI-Button-1, .QuaUI-Button-2, .QuaUI-Card {
            box-sizing: border-box; /* Lepsze zarządzanie paddingiem i borderem */
        }

        /* === QuaUI: Komponenty === */

        /* Przycisk Podstawowy - QuaUI-Button-1 */
        .QuaUI-Button-1 {
            background-color: #007bff; /* Niebieski */
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-family: Arial, sans-serif;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            transition: background-color 0.3s ease, transform 0.1s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .QuaUI-Button-1:hover {
            background-color: #0056b3; /* Ciemniejszy niebieski */
        }

        .QuaUI-Button-1:active {
            background-color: #004085; /* Jeszcze ciemniejszy */
            transform: scale(0.98); /* Lekkie wciśnięcie */
        }

        /* Przycisk Akcentowy - QuaUI-Button-2 (np. zielony) */
        .QuaUI-Button-2 {
            background-color: #28a745; /* Zielony */
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-family: Arial, sans-serif;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            transition: background-color 0.3s ease, transform 0.1s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .QuaUI-Button-2:hover {
            background-color: #1e7e34; /* Ciemniejszy zielony */
        }

        .QuaUI-Button-2:active {
            background-color: #155724; /* Jeszcze ciemniejszy */
            transform: scale(0.98);
        }

        /* Karta - QuaUI-Card */
        .QuaUI-Card {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: box-shadow 0.3s ease-in-out;
        }

        .QuaUI-Card:hover {
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .QuaUI-Card-Title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-top: 0;
            margin-bottom: 10px;
        }

        .QuaUI-Card-Text {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
        }

        /* Dodaj tutaj więcej stylów dla innych komponentów */
    `;

    // Tworzenie elementu <style>
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    // Dodawanie stylów do elementu <style>
    if (styleElement.styleSheet) {
        // Dla starszych wersji IE
        styleElement.styleSheet.cssText = cssStyles;
    } else {
        // Dla nowoczesnych przeglądarek
        styleElement.appendChild(document.createTextNode(cssStyles));
    }

    // Dodawanie elementu <style> do <head> dokumentu
    // Użyjemy 'DOMContentLoaded' aby upewnić się, że <head> istnieje,
    // chociaż dla skryptu ładowanego w <head> nie jest to ściśle konieczne.
    // Alternatywnie, można po prostu dodać bez czekania, jeśli skrypt jest w <head>.
    document.addEventListener('DOMContentLoaded', function() {
        document.head.appendChild(styleElement);
    });
    // Jeśli skrypt jest zawsze na końcu <body> lub używa `defer`, to DOMContentLoaded nie jest konieczne
    // dla samego dodania stylów, można to zrobić od razu:
    // document.head.appendChild(styleElement);
    // Jednakże, dla pewności i uniwersalności, użycie DOMContentLoaded jest bezpieczniejsze,
    // jeśli nie wiemy, gdzie użytkownik umieści skrypt.
    // W tym przypadku, ponieważ skrypt ma być wklejony (prawdopodobnie w head), można by to uprościć:
    // document.head.appendChild(styleElement);
    // Wybieram wersję z DOMContentLoaded jako bardziej robustną, gdyby użytkownik wkleił skrypt gdzie indziej.
    // Jeśli skrypt jest w <head> i nie ma atrybutu `defer` ani `async`, wykona się synchronicznie,
    // więc `document.head` już będzie dostępne.
    // Uproszczona wersja dla skryptu w <head>:
    if (document.head) {
        document.head.appendChild(styleElement);
    } else {
        // Fallback, jeśli coś poszło bardzo nie tak lub skrypt jest w dziwnym miejscu
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(styleElement);
        });
    }


})(); // Samowywołująca się funkcja, aby uniknąć zanieczyszczania globalnego scope
