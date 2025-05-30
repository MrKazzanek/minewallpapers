// translations.js

const interfaceTranslations = {
    pl: {
        searchPlaceholder: "Szukaj tapet...",
        bannerTitle: "Najlepsze tapety z uniwersum Minecrafta",
        bannerCount: "Mamy już {count} tapet",
        bannerSubtext: "Nowe tapety co tydzień w środy!", // Point 4
        selectCategory: "Kategoria:",
        randomButton: "Losuj tapetę", // Text for aria-label
        publishButton: "Opublikuj tapetę",
        languageButton: "Change to English",
        downloadButton: "Pobierz", // For grid items
        authorLabel: "Autor",
        categoryLabel: "Kategoria",
        themeToggleButton: {
            system: "Zmień motyw (aktualnie: systemowy)",
            light: "Zmień motyw (aktualnie: jasny)",
            dark: "Zmień motyw (aktualnie: ciemny)"
        },
        closePreview: "Zamknij podgląd",
        previewDownload: "Pobierz tapetę", // For modal button text
        previewAlt: "Podgląd: {title}",
        noResults: "<font style='font-family: Minecraft; font-size: 30px;'>Brak pasujących tapet.</font>",
        noWallpapersInCategory: "Brak tapet w tej kategorii do wylosowania.",
        allWallpapersRandomized: "Wszystkie tapety z tej selekcji zostały wylosowane! Zmień filtry lub odśwież, aby zacząć od nowa.", // Point 9
        downloadFailed: "Pobieranie nie powiodło się.", // For download errors
        footerRights: "Wszelkie prawa zastrzeżone.", // Point 5
        scrollToTopLabel: "Przewiń do góry", // Point 6
        newTag: "Nowa", // Point 8
        setupComplete: "Ustawienia zapisane!",
    },
    en: {
        searchPlaceholder: "Search wallpapers...",
        bannerTitle: "The best wallpapers from the Minecraft universe",
        bannerCount: "We already have {count} wallpapers",
        bannerSubtext: "New wallpapers every week on Wednesdays!", // Point 4
        selectCategory: "Category:",
        randomButton: "Random wallpaper", // Text for aria-label
        publishButton: "Publish wallpaper",
        languageButton: "Zmień na Polski",
        downloadButton: "Download", // For grid items
        authorLabel: "Author",
        categoryLabel: "Category",
        themeToggleButton: {
            system: "Change theme (current: system)",
            light: "Change theme (current: light)",
            dark: "Change theme (current: dark)"
        },
        closePreview: "Close preview",
        previewDownload: "Download Wallpaper", // For modal button text
        previewAlt: "Preview: {title}",
        noResults: "<font style='font-family: Minecraft; font-size: 30px;'>No matching wallpapers found.</font>",
        noWallpapersInCategory: "No wallpapers in this category to randomize.",
        allWallpapersRandomized: "All wallpapers from this selection have been randomized! Change filters or refresh to start over.", // Point 9
        downloadFailed: "Download failed.", // For download errors
        footerRights: "All rights reserved.", // Point 5
        scrollToTopLabel: "Scroll to top", // Point 6
        newTag: "New", // Point 8
        setupComplete: "Settings saved!",
    }
};

const categoryDefinitions = {
    all: { pl: "Wszystkie", en: "All" }, landscapes: { pl: "Krajobrazy", en: "Landscapes" }, builds: { pl: "Budowle", en: "Builds" }, updates: { pl: "Aktualizacje", en: "Updates" }, structures: { pl: "Struktury", en: "Structures" },  dungeons: { pl: "Minecraft Dungeons", en: "Minecraft Dungeons" }, legends: { pl: "Minecraft Legends", en: "Minecraft Legends" }, movie: { pl: "Film Minecraft", en: "Minecraft Movie" }, mods: { pl: "Modyfikacje", en: "Modifications" }, other: { pl: "Inne", en: "Other" }
};

const wallpaperContentTranslations = {
    pl: {
        1: { title: "Wysokie Góry (Vanilla)", description: "Ośnieżone góry i zachód słońca.", category_key: "landscapes" },
        2: { title: "Wysokie Góry (Shaders)", description: "Ośnieżone góry i zachód słońca. Użyte Complementary Shaders.", category_key: "landscapes" },
        3: { title: "Wysokie Góry (Shaders + Bare Bones)", description: "Ośnieżone góry i zachód słońca. Użyte Complementary Shaders i Bare Bones.", category_key: "landscapes" },
        4: { title: "Tricky Trials (Vanilla)", description: "Tapeta przedstawiająca główną część aktualizacji Tricky Trials.", category_key: "updates" },
        5: { title: "Tricky Trials (Shaders)", description: "Tapeta przedstawiająca główną część aktualizacji Tricky Trials. Użyte Complementary Shaders.", category_key: "updates" },
        6: { title: "Tricky Trials (Shaders + Bare Bones)", description: "Tapeta przedstawiająca główną część aktualizacji Tricky Trials. Użyte Complementary Shaders i Bare Bones.", category_key: "updates" },
        7: { title: "Wysokie Klify", description: "Gigantyczne klify zanurzone w wodzie. Użyte Complementary Shaders.", category_key: "landscapes" },
        8: { title: "Śnieżyca na górze", description: "Śnieżyca na górze podczas nocy. Użyte BSL Shaders.", category_key: "landscapes" },
        9: { title: "Netherowy basen", description: "Wielki ocean lawy w piekle. Użyte BSL Shaders.", category_key: "landscapes" },
        10: { title: "Brzozowy las", description: "Piękny brzozowy las z widokiem na rzekę. Użyte BSL Shaders.", category_key: "landscapes" },
        11: { title: "Czy to portal?", description: "To już prawie koniec... Użyte BSL Shaders.", category_key: "structures" },
        12: { title: "Deszcz TNT", description: "Spadające TNT z nieba. Uważaj na głowę!", category_key: "other" },
        13: { title: "Las przy rzece", description: "Piękna rzeka przy której rośnie las. Użyte PRIZMA RTX.", category_key: "landscapes" },
        14: { title: "Środek piramidy", description: "Centralna część pustynnej struktury, pod którą znajduje się cenny łup. Użyte BSL Shaders.", category_key: "structures" },
        15: { title: "Biblioteka (Vanilla)", description: "Wszechstronna Biblioteka z drzewkiem Azali.", category_key: "builds" },
        16: { title: "Biblioteka (Shaders)", description: "Wszechstronna Biblioteka z drzewkiem Azali. Użyte Complementary Shaders.", category_key: "builds" },
        17: { title: "Biblioteka (Shaders + Bare Bones)", description: "Wszechstronna Biblioteka z drzewkiem Azali. Użyte Complementary Shaders i Bare Bones.", category_key: "builds" },
        18: { title: "Miasto końca", description: "To jest miejsce gdzie znajdziesz skrzydła... Użyte Complementary Shaders.", category_key: "structures" },
        19: { title: "Nostalgia", description: "Porównaj stare tekstury Minecraft Console Edition do Minecraft Bedrock Edition.", category_key: "other" },
        20: { title: "Steve trzyma kamerę", description: "A może on se robi selfie?", category_key: "other" },
        21: { title: "Wielbłąd i sniffer na tle zachodu", description: "Pustynny klimat z wielbłądem i snifferem. Użyte Complementary Shaders i Bare Bones.", category_key: "landscapes" },
        22: { title: "Azaliowa ściana", description: "Ściana jak w twoim zielonym pokoju.", category_key: "other" },
        23: { title: "Netherowy zamek", description: "Netherowy zamek czyli inaczej Netherowa forteca. Użyte Complementary Shaders.", category_key: "structures" },
        24: { title: "Zmrok", description: "Najciemniej pod latarnią.", category_key: "other" },
        25: { title: "Pomieszczenie próby", description: "Tapeta przedstawia jedno z pomieszczeń komnat próby.", category_key: "structures" },
        26: { title: "Blady Las (Vanilla)", description: "Blady Ogród z aktualizacji 1.21.4 podczas nocy.", category_key: "updates" },
        27: { title: "Blady Las (Shaders)", description: "Blady Ogród z aktualizacji 1.21.4 podczas nocy. Użyte Complementary Shaders.", category_key: "updates" },
        28: { title: "Leśna panorama", description: "Widok z lotu ptaka na las. Użyte Complementary Shaders.", category_key: "landscapes" },
        29: { title: "Rezka w lesie", description: "Rzeka w lesie i świetliki na pierwszym planie. Użyto Realism Craft i Realistic Biomes", category_key: "mods" },
        30: { title: "Latający ląd", description: "Kawałek góry w powietrzu. Użyto Realism Craft i Realistic Biomes", category_key: "mods" },
        31: { title: "Stary widok z plaży", description: "Nostalgiczna tapeta z starych wersji Minecraft.", category_key: "landscapes" },
        32: { title: "Ognisko", description: "Rozpal ognisko to może zjemy coś. Użyte Complementary Shaders.", category_key: "builds" },
        33: { title: "Brama Endu", description: "Ściana wyglądająca jak kosmos. Użyte Complementary Shaders.", category_key: "other" },
        34: { title: "Creeper na jesień", description: "Creeper na tle gierki Minecraft Dungeons.", category_key: "dungeons" },
        35: { title: "Ściana portalu", description: "Fioletowa ściana zrobiona z tekstury portalu do Netheru. Użyte BSL Shaders.", category_key: "other" },
        36: { title: "Ściana portalu", description: "Fioletowa ściana zrobiona z tekstury portalu do Netheru. Użyte Complementary Shaders.", category_key: "other" },
        37: { title: "Wioska nad rzeką", description: "Piękna sawannowa wioska tuż przy zbiorniku wody, położona w górach. Użyte Complementary Shaders.", category_key: "structures" },
        38: { title: "Skrzypienie", description: "Czy to gracz czy to Creaking? Nie to Bluzers.", category_key: "other" },
        39: { title: "Steve utknął", description: "Steve w rurze na Bedrockowym evencie Minecraft Office Party.", category_key: "other" },
        40: { title: "Blady Ogród", description: "Las Creakinga podczas nocy. Użyte Complementary Shaders i Bare Bones.", category_key: "landscapes" },
        41: { title: "Legendarny widok", description: "Gracz patrzący na piękną rzekę.", category_key: "legends" },
        42: { title: "Wioska Midport", description: "Słynna wioska z Filmu Minecraft.", category_key: "movie" },
        43: { title: "Bujna jaskinia", description: "Tapeta przedstawiająca jeden z podziemnych biomów. Użyte Bare Bones.", category_key: "landscapes" },
        44: { title: "Zaśnieżone szczyty", description: "Na zdjęciu widać kozę na zaśnieżonych szczytach. Użyte Bare Bones.", category_key: "landscapes" },
        45: { title: "Miodowa kraina", description: "Budowla w stylu miodowej wioski. Użyte Bare Bones.", category_key: "builds" },
        46: { title: "Orientalna dolina", description: "Piękny mały wodospad spadający do również małego i pięknego jeziorka. Użyte Bare Bones.", category_key: "builds" },
        47: { title: "Odświeżony las brzozowy", description: "Odświeżony brzozowy las niczym z zapowiedzi od Mojangu.", category_key: "mods" },
        48: { title: "Gaj wiśniowy", description: "Krajobraz biomu dodanego w aktualizacji 1.20. Użyte Complementary Shaders.", category_key: "landscapes" },
        49: { title: "Świetlikowe bagna", description: "W końcu po tylu latach świetliki zawitały nam do Minecrafta!", category_key: "updates" },
        50: { title: "Goodlands", description: "Badlandsy czy Goodlandsy? Tapeta zrobiona podczas eventu Mojang Office Party.", category_key: "other" },
        51: { title: "Leśny klif", description: "Zwykły las na niewielkim klifie.", category_key: "landscapes" },
        52: { title: "Pieczony królik", description: "Maskotka królika nad ogniem.", category_key: "other" },
        53: { title: "Armia ocelotów", description: "A ty wierzysz w kult ocelotów?", category_key: "other" },
        54: { title: "Porównywanie", description: "Tapeta z eventu MC Championship x Minecraft 15th Anniversary Party.", category_key: "other" },
        55: { title: "Dziura na Zachod Słońca", description: "Kopiesz dziurę i patrzysz w niebo, co widzisz? Bo ja zachód słońca.", category_key: "other" },
    },
    en: {
        1: { title: "High Mountains (Vanilla)", description: "Snowy mountains and sunset.", category_key: "landscapes" },
        2: { title: "High Mountains (Shaders)", description: "Snowy mountains and sunset. Complementary Shaders used.", category_key: "landscapes" },
        3: { title: "High Mountains (Shaders + Bare Bones)", description: "Snowy mountains and sunset. Complementary Shaders and Bare Bones used.", category_key: "landscapes" },
        4: { title: "Tricky Trials (Vanilla)", description: "Wallpaper showing the main part of the Tricky Trials update.", category_key: "updates" },
        5: { title: "Tricky Trials (Shaders)", description: "Wallpaper showing the main part of the Tricky Trials update.  Complementary Shaders used.", category_key: "updates" },
        6: { title: "Tricky Trials (Shaders + Bare Bones)", description: "Wallpaper showing the main part of the Tricky Trials update. Complementary Shaders and Bare Bones used.", category_key: "updates" },
        7: { title: "High cliffs", description: "Giant cliffs submerged in water. Complementary Shaders used.", category_key: "landscapes" },
        8: { title: "Snowstorm on the mountain", description: "Snowstorm on the mountain during the night. BSL Shaders used.", category_key: "landscapes" },
        9: { title: "Nether Pool", description: "Great ocean of lava in hell. BSL Shaders used.", category_key: "landscapes" },
        10: { title: "Birch Forest", description: "Beautiful Birch Forest overlooking the river. BSL Shaders used.", category_key: "landscapes" },
        11: { title: "Is this a portal?", description: "It's almost done... BSL Shaders used.", category_key: "structures" },
        12: { title: "TNT Rain", description: "TNT falling from the sky. Watch your head!", category_key: "other" },
        13: { title: "Forest by the river", description: "Beautiful river with a forest growing by it. PRIZMA RTX used.", category_key: "landscapes" },
        14: { title: "Center of the pyramid", description: "The central part of the desert structure, underneath which lies the valuable loot. BSL Shaders used.", category_key: "structures" },
        15: { title: "Library (Vanilla)", description: "The Versatile Library with the Azalea Tree.", category_key: "builds" },
        16: { title: "Library (Shaders)", description: "The Versatile Library with the Azalea Tree. Complementary Shaders used.", category_key: "builds" },
        17: { title: "Library (Shaders + Bare Bones)", description: "The Versatile Library with the Azalea Tree. Complementary Shaders and Bare Bones used.", category_key: "builds" },
        18: { title: "The city of the End", description: "This is where you'll find the wings... Complementary Shaders used.", category_key: "structures" },
        19: { title: "Nostalgia", description: "Compare old Minecraft Console Edition textures to Minecraft Bedrock Edition.", category_key: "other" },
        20: { title: "Steve holds a camera", description: "Or maybe he is taking a selfie?", category_key: "other" },
        21: { title: "A camel and a sniffer against the sunset background", description: "Desert atmosphere with camel and sniffer. Complementary Shaders and Bare Bones used.", category_key: "landscapes" },
        22: { title: "Azalea wall", description: "A wall like in your green room.", category_key: "other" },
        23: { title: "Nether Castle", description: "Nether Castle or Nether Fortress. Complementary Shaders used.", category_key: "structures" },
        24: { title: "Dusk", description: "It's darkest under the lamppost.", category_key: "other" },
        25: { title: "Trial room", description: "The wallpaper shows one of the rooms of the trial chambers.", category_key: "structures" },
        26: { title: "Pale Forest (Vanilla)", description: "The Pale Garden from update 1.21.4 at night.", category_key: "updates" },
        27: { title: "Pale Forest (Shaders)", description: "The Pale Garden from update 1.21.4 at night. Complementary Shaders used.", category_key: "updates" },
        28: { title: "Forest Panorama", description: "Aerial view of the forest. Complementary Shaders used.", category_key: "landscapes" },
        29: { title: "River in the forest", description: "River in the forest and fireflies in the foreground. Realism Craft and Realistic Biomes used", category_key: "mods" },
        30: { title: "Flying Land", description: "A piece of mountain in the air. Realism Craft and Realistic Biomes used", category_key: "mods" },
        31: { title: "Old view from the Beach", description: "Nostalgic wallpaper from old versions of Minecraft.", category_key: "landscapes" },
        32: { title: "Campfire", description: "Light a fire and maybe we'll eat something. Complementary Shaders used.", category_key: "builds" },
        33: { title: "End Gateway", description: "A space-looking wall. Complementary Shaders used.", category_key: "other" },
        34: { title: "Creeper for Autumn", description: "Creeper against the background of the game Minecraft Dungeons.", category_key: "dungeons" },
        35: { title: "Portal Wall", description: "Purple wall made from Nether portal texture. BSL Shaders used.", category_key: "other" },
        36: { title: "Portal Wall", description: "Purple wall made from Nether portal texture. Complementary Shaders used.", category_key: "other" },
        37: { title: "Village by the river", description: "Beautiful savannah village right next to a water reservoir, located in the mountains. Complementary Shaders used.", category_key: "structures" },
        38: { title: "Creak", description: "Is that a player or is that Creaking? No that's Bluzers.", category_key: "other" },
        39: { title: "Steve stuck", description: "Steve in a pipe at the Minecraft Office Party Bedrock event.", category_key: "other" },
        40: { title: "Pale Garden", description: "Creaking Forest at night. Complementary Shaders and Bare Bones used.", category_key: "landscapes" },
        41: { title: "Legendary View", description: "Player looking at a beautiful river.", category_key: "legends" },
        42: { title: "Midport Village", description: "The famous village from the Minecraft Movie.", category_key: "movie" },
        43: { title: "Lush Cave", description: "Wallpaper of one of the underground biomes. Used Bare Bones.", category_key: "landscapes" },
        44: { title: "Snow-covered peaks", description: "The photo shows a goat on snowy peaks. Bare Bones used.", category_key: "landscapes" },
        45: { title: "Honeyland", description: "Honey Village style building. Bare Bones used.", category_key: "builds" },
        46: { title: "Oriental Valley", description: "Beautiful little waterfall falling into an equally small and beautiful lake. Used Bare Bones.", category_key: "builds" },
        47: { title: "Refreshed Birch Forest", description: "A refreshed birch forest as seen in Mojang's announcement.", category_key: "mods" },
        48: { title: "Cherry Grove", description: "Landscape of the biome added in update 1.20. Complementary Shaders used.", category_key: "landscapes" },
        49: { title: "Firefly Swamp", description: "After all these years, fireflies have finally come to Minecraft!", category_key: "updates" },
        50: { title: "Goodlands", description: "Badlands or Goodlands? Wallpaper made during the Mojang Office Party event.", category_key: "other" },
        51: { title: "Forest Cliff", description: "An ordinary forest on a small cliff.", category_key: "landscapes" },
        52: { title: "Roasted rabbit", description: "A rabbit mascot above a fire.", category_key: "other" },
        53: { title: "Ocelot Army", description: "Do you believe in the ocelot cult?", category_key: "other" },
        54: { title: "Comparing", description: "Wallpaper from the MC Championship x Minecraft 15th Anniversary Party event.", category_key: "other" },
        55: { title: "Sunset Hole", description: "You dig a hole and look at the sky, what do you see? Because I see a sunset.", category_key: "other" },
    }
};

// Point 1: URLs are now handled directly in the script.js event listener
// const publishUrl = "https://example.com/publish"; // REMOVED