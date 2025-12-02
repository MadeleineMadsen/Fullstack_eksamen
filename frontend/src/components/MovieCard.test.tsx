// Test komponent
const TestMovieCard = () => {
  const testMovie: Movie = {
    id: 1,
    title: "Inception",
    rating: 8.8,
    released: "2010-07-16",
    poster_image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  };

  return <MovieCard movie={testMovie} />;
};