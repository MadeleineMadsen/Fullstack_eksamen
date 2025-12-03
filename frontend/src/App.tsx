// // frontend/src/App.tsx
// import React, { useState } from 'react';
// import GenreList from './components/GenreList';
// import MovieGrid from './components/MovieGrid';
// import SearchInput from './components/SearchInput';
// import SortSelector from './components/SortSelector';
// import { useMovies } from './hooks/useMovies'; //virker når hooks og services er lavet
// import './style/kamilla.css';

// function App() {
//     const [searchText, setSearchText] = useState('');
//     const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
//     const [sortOrder, setSortOrder] = useState('');

//     const { data, isLoading, error } = useMovies();

//     if (isLoading) {
//         return React.createElement('div', null, 'Loading movies...');
//     }

//     if (error) {
//         return React.createElement('div', null, 'Error loading movies');
//     }

//     const movies = data?.results || [];

//     // Filtrer og sorter film
//     let filteredMovies = movies.filter(movie =>
//         movie.title.toLowerCase().includes(searchText.toLowerCase())
//     );

//     if (sortOrder === 'rating') {
//         filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     } else if (sortOrder === 'released') {
//         filteredMovies.sort((a, b) => new Date(b.released || '').getTime() - new Date(a.released || '').getTime());
//     } else if (sortOrder === 'title') {
//         filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
//     }

//     const handleSearch = (text: string) => {
//         setSearchText(text);
//     };

//     const handleGenre = (genreId: number) => {
//         setSelectedGenre(genreId);
//     };

//     const handleSort = (sortOrder: string) => {
//         setSortOrder(sortOrder);
//     };

//     return React.createElement('div', null,
//         React.createElement('div', { className: 'filter-container' },
//             React.createElement(SearchInput, { onSearch: handleSearch }),
//             React.createElement(GenreList, { onSelectGenre: handleGenre }),
//             React.createElement(SortSelector, { onSelectSort: handleSort })
//         ),
//         React.createElement('div', { style: { padding: '20px' } },
//             React.createElement('p', null, `Viser ${filteredMovies.length} film`),
//             React.createElement(MovieGrid, { movies: filteredMovies })
//         )
//     );
// }

// export default App;













import React, { useState } from 'react';
import GenreList from './components/GenreList';
import MovieGrid from './components/MovieGrid';
import NavBar from './components/NavBar';
import SearchInput from './components/SearchInput';
import SortSelector from './components/SortSelector';
import './style/kamilla.css';

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState('');

  const testMovies = [
    {
      id: 1,
      title: "Inception",
      rating: 8.8,
      released: "2010-07-16",
      poster_image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
      id: 2, 
      title: "The Dark Knight",
      rating: 9.0,
      released: "2008-07-18",
      poster_image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
      id: 3,
      title: "Interstellar",
      rating: 8.6, 
      released: "2014-11-07",
      poster_image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
      id: 4,
      title: "Avatar",
      rating: 7.8,
      released: "2009-12-18", 
      poster_image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
    }
  ];

  // Filtrer og sorter film
  let filteredMovies = testMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (selectedGenre) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.title.includes('Action')
    );
  }

  // Sorter film
  if (sortOrder === 'rating') {
    filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortOrder === 'released') {
    filteredMovies.sort((a, b) => new Date(b.released || '').getTime() - new Date(a.released || '').getTime());
  } else if (sortOrder === 'title') {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  }

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleGenre = (genreId: number) => {
    setSelectedGenre(genreId);
  };

  const handleSort = (sortOrder: string) => {
    setSortOrder(sortOrder);
  };
  
  return React.createElement('div', { className: 'app-container' },
    React.createElement(NavBar),
    React.createElement('div', { className: 'filter-container' },
      React.createElement(SearchInput, { onSearch: handleSearch }),
      React.createElement('div', { className: 'filters-right' },
        React.createElement(GenreList, { onSelectGenre: handleGenre }),
        React.createElement(SortSelector, { onSelectSort: handleSort })
      )
    ),
    React.createElement('div', { className: 'movie-list-container' },
      React.createElement('p', null, `Viser ${filteredMovies.length} film`),
      React.createElement(MovieGrid, { movies: filteredMovies })
    )
  );
};

export default App;