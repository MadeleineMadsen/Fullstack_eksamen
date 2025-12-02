// frontend/src/pages/MovieDetailPage.tsx
import React from 'react';

const MovieDetailPage = () => {
    // Hent ID fra URL'en (simplet)
    const path = window.location.pathname;
    const id = path.split('/movies/')[1];

    // Hardcodet film
    const movie = {
        id: Number(id),
        title: "Inception",
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        released: "2010-07-16",
        runtime: 148,
        rating: 8.8,
        poster_image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        background_image: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        director: "Christopher Nolan"
    };

    const handleBack = () => {
        window.history.back();
    };

    return React.createElement('div', { className: 'movie-detail' },
        React.createElement('div', { className: 'movie-detail-header' },
            React.createElement('img', {
                src: movie.background_image,
                alt: movie.title,
                className: 'movie-detail-background'
            }),
            React.createElement('button', {
                className: 'back-button',
                onClick: handleBack
            }, '← Tilbage')
        ),
        React.createElement('div', { className: 'movie-detail-content' },
            React.createElement('img', {
                src: movie.poster_image,
                alt: movie.title,
                className: 'movie-detail-poster'
            }),
            React.createElement('div', { className: 'movie-detail-info' },
                React.createElement('h1', null, movie.title),
                React.createElement('div', { className: 'movie-detail-rating' },
                    '⭐ ', movie.rating, '/10'
                ),
                React.createElement('p', null, 'Udgivet: ', movie.released),
                React.createElement('p', null, 'Varighed: ', movie.runtime, ' minutter'),
                React.createElement('p', null, 'Instruktør: ', movie.director),
                React.createElement('p', { className: 'movie-detail-overview' }, movie.overview)
            )
        )
    );
};

export default MovieDetailPage;