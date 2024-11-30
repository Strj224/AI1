// Definicja słownika stylów: nazwa stylu -> ścieżka do pliku CSS
const styles: Record<string, string> = {
    'Styl 1': 'css/style1.css',
    'Styl 2': 'css/style2.css',
};

// Funkcja zmieniająca styl
function changeStyle(styleName: string): void {
    // Znajdź istniejący element <link> odpowiadający za styl
    const styleLink = document.getElementById('style-link') as HTMLLinkElement;

    // Zmień atrybut href na wybraną ścieżkę ze słownika
    if (styleLink && styles[styleName]) {
        styleLink.href = styles[styleName];
    }
}

// Generowanie dynamicznych przycisków do zmiany stylu
function generateStyleButtons(): void {
    // Znajdź kontener, w którym mają być przyciski (np. div w HTML)
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.margin = '20px';
    // Iteracja przez klucze słownika stylów
    Object.keys(styles).forEach((styleName) => {
        // Tworzenie przycisku
        const button = document.createElement('button');
        button.textContent = styleName;
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#FFF';
        button.style.cursor = 'pointer';

        // Obsługa zdarzenia kliknięcia
        button.addEventListener('click', () => changeStyle(styleName));
        // Dodanie przycisku do kontenera
        buttonContainer.appendChild(button);
    });

    // Dodanie kontenera z przyciskami do strony (np. na końcu main)
    document.body.appendChild(buttonContainer);
}

// Wywołanie funkcji generującej przyciski przy ładowaniu strony
generateStyleButtons();