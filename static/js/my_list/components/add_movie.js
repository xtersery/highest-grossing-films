// addMovie.js
import { toast } from 'react-toastify';

const addMovie = async (title, newMovieRating, movies, setMovies, setTitle, setNewMovieRating, setSelectedSuggestion) => {
  try {
    // Check if any movie with the same title (case-insensitive) already exists in the list
    const isDuplicate = movies.some((movie) => movie.title.toLowerCase() === title.toLowerCase());
    if (isDuplicate) {
      toast.error('A movie with the same title already exists!');
      return;
    }

    const body = { title, rating: newMovieRating };
    const response = await fetch('http://localhost:5001/dashboard/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.token,
      },
      body: JSON.stringify(body),
    });
    const parseRes = await response.json();
    setMovies([...movies, parseRes]);
    setTitle('');
    setNewMovieRating(''); // Reset newMovieRating state
    setSelectedSuggestion(null);
    toast.success('Movie added successfully!');
  } catch (err) {
    console.error(err.message);
  }
};

export default addMovie;