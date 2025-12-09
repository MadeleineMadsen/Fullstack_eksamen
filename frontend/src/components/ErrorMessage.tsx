import React from 'react';

// Props til komponenten:
// message  → teksten der skal vises (eller null hvis ingen fejl)
// onClose  → valgfri funktion der kaldes når brugeren trykker "×"
interface ErrorMessageProps {
    message?: string | null;
    onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
    // Hvis ingen fejlbesked → render ingenting
    if (!message) return null;

     // Returnerer en simpel error-boks som indeholder:
    // - selve fejlteksten
    // - en luk-knap hvis onClose er givet
    return React.createElement(
        'div',
        { className: 'error-message' },// CSS-klassen styrer styling af fejlcontainer
        React.createElement('span', null, message), // viser fejlbeskeden
        // Hvis en onClose-funktion er givet, vis knap til at lukke beskeden
        onClose &&
        React.createElement(
            'button',
            {
                type: 'button',
                onClick: onClose,   // Kald onClose når knappen trykkes
                className: 'error-close-button',// CSS-klasse til styling
            },
            '×'// Luk-ikon
        )
    );
};

export default ErrorMessage;

