import React from 'react';

interface ErrorMessageProps {
    message?: string | null;
    onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
    if (!message) return null;

    return React.createElement(
        'div',
        { className: 'error-message' },
        React.createElement('span', null, message),
        onClose &&
        React.createElement(
            'button',
            {
                type: 'button',
                onClick: onClose,
                className: 'error-close-button',
            },
            '×'
        )
    );
};

export default ErrorMessage;

