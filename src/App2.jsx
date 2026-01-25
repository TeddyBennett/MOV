import { useContext, useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/Header';
import Content from './components/Content';
import { useDebounce } from 'use-debounce';
import Pagination from './components/Pagination'
// import { useDataContext } from './data/DataContext';
import { Toaster } from "./components/ui/toaster"

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("AllMovie");
  const [trendMovies, setTrendMovies] = useState(() => {
    const storedMovie = localStorage.getItem("trendMovies");
    return storedMovie ? JSON.parse(storedMovie) : [];
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { options, accountID } = useDataContext();
  const filteredMovieRef = useRef([]);
  const loadedPages = useRef(0);
  const moviesPerPage = 20;
  const loadPerPage = 2; // Reduced from 5 to 2

  function adjustCategoryPosition() {
    setTimeout(() => {
      const mainContainer = document.querySelector('.main-flex-container');
      const movie = document.querySelector('.movie-card');
      const moviecategory = document.querySelector('.movie-category');

      if (mainContainer && movie && moviecategory) {
        const mainContainerRect = mainContainer.getBoundingClientRect();
        const movieRect = movie.getBoundingClientRect();
        const horizontalDistance = movieRect.left - mainContainerRect.left;
        const verticalDistance = movieRect.top - mainContainerRect.top;
        moviecategory.style.left = `${horizontalDistance}px`;
        moviecategory.style.top = `${verticalDistance - 50}px`;
      }
    }, 300);
  }

  // ✅ Optimized resize with throttling
  useEffect(() => {
    adjustCategoryPosition();
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        adjustCategoryPosition();
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [movies]);

  function updateLocalTrendMovies(firstIndexMovie) {
    const isTrendMovieExist = trendMovies.find(movie => movie.id === firstIndexMovie.id);
    let updatedTrendMovies = [];

    if (isTrendMovieExist) {
      updatedTrendMovies = trendMovies.map(movie =>
        movie.id === firstIndexMovie.id ? { ...movie, count: movie.count + 1 } : movie
      );
    } else {
      updatedTrendMovies = [...trendMovies, { ...firstIndexMovie, count: 1 }];
    }

    setTrendMovies(updatedTrendMovies);
    localStorage.setItem('trendMovies', JSON.stringify(updatedTrendMovies));
  }

  function updateDisplayedMoviesForGenreSearchTerm(allMovies) {
    const startIndex = (currentPage - 1) * moviesPerPage;
    setMovies(allMovies.slice(startIndex, startIndex + moviesPerPage));
  }

  function fetchMovie() {
    setIsLoading(true);
    let fetchUrl = !debouncedSearchTerm
      ? `https://api.themoviedb.org/3/movie/popular?page=${currentPage}`
      : `https://api.themoviedb.org/3/search/movie?page=${currentPage}&sort_by=popularity.desc&query=${encodeURIComponent(debouncedSearchTerm)}`;

    fetch(fetchUrl, options)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        if (debouncedSearchTerm) updateLocalTrendMovies(data.results[0]);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(err => console.error("Fetch failed:", err))
      .finally(() => setIsLoading(false));
  }

  async function fetchMoviByGenre(genreId) {
    try {
      setIsLoading(true);

      if (!debouncedSearchTerm) {
        let fetchUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${currentPage}&sort_by=popularity.desc`;

        if (genreId === 999999 || genreId === 9999999 || genreId === 99999999) {
          if (genreId === 999999 || genreId === 9999999) {
            let time = genreId === 999999 ? 'day' : 'week';
            fetchUrl = `https://api.themoviedb.org/3/trending/movie/${time}?&page=${currentPage}&sort_by=popularity.desc`;
          } else if (genreId === 99999999) {
            fetchUrl = `https://api.themoviedb.org/4/account/${accountID}/movie/favorites?page=${currentPage}`;
          }
        }

        const response = await fetch(fetchUrl, options);
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages);
        setIsLoading(false);
        return;
      }

      if (
        filteredMovieRef.current.length > 0 &&
        currentPage < totalPages - 1
      ) {
        setIsLoading(false);
        return;
      }

      let page = loadedPages.current + 1;
      let targetPage = page + loadPerPage - 1;
      let newMovies = [];
      let count = 0;

      while (page <= targetPage) {
        const fetchUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
        const response = await fetch(fetchUrl, options);
        const data = await response.json();
        newMovies = [...newMovies, ...data.results];
        if (page >= data.total_pages) break;
        page++;
        count++;
      }

      // ✅ Filter with idle callback
      const filterMovies = () => {
        const filteredResults = newMovies.filter(movie =>
          movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        filteredMovieRef.current = [...filteredMovieRef.current, ...filteredResults];
        setMovies(filteredMovieRef.current);
        setTotalPages(Math.ceil(filteredMovieRef.current.length / moviesPerPage));
        updateDisplayedMoviesForGenreSearchTerm(filteredMovieRef.current);
        loadedPages.current += count;
        setIsLoading(false);
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(filterMovies);
      } else {
        filterMovies();
      }
    } catch (error) {
      console.error("Fetching by genre failed:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    filteredMovieRef.current = [];
    loadedPages.current = 0;
  }, [debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    if (debouncedSearchTerm && selectedCategory !== "AllMovie") {
      fetchMoviByGenre(selectedCategory);
    } else if (debouncedSearchTerm) {
      fetchMovie();
    } else if (selectedCategory !== "AllMovie") {
      fetchMoviByGenre(selectedCategory);
    } else {
      fetchMovie();
    }
  }, [debouncedSearchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    if (filteredMovieRef.current.length > 0) {
      updateDisplayedMoviesForGenreSearchTerm(filteredMovieRef.current);
    }
  }, [currentPage]);

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Content
        movies={movies}
        trendMovies={trendMovies}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isLoading={isLoading}
        currentPage={currentPage}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
      <Toaster />
    </>
  );
}

export default App;
