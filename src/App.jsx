import Header from './components/Header'
import Banner from './components/Banner'
import MovieList from './components/MovieList'
import { useState, useEffect } from 'react'
import MovieSearch from './components/MovieSearch'


function App() {
  const [movie, setMovie] = useState([])
  const [movieRate, setMovieRate] = useState([])
  const [movieSearch, setMovieSearch] = useState([])

  const handleSearch = async (searchValue) => {
    setMovieSearch([])
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=vi&page=1`;
      const option = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      }
      const searchMovie = await fetch(url, option);
      const data = await searchMovie.json();
      setMovieSearch(data.results)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchMovie = async () => {
      const option = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      }
      const url1 = 'https://api.themoviedb.org/3/movie/popular?language=vi&page=1'
      const url2 = 'https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1'

      try {
        const [res1, res2] = await Promise.all([
          fetch(url1, option),
          fetch(url2, option)
        ])

        if (!res1.ok || !res2.ok) {
          throw new Error('Failed to fetch data')
        }

        const data1 = await res1.json()
        const data2 = await res2.json()

        setMovie(data1.results) // Assuming `data1.results` is the array of movies
        setMovieRate(data2.results) // Assuming `data2.results` is the array of top-rated movies
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMovie()
  }, [])

  return (
    <>
      <div className='bg-black pb-10'>
        <Header onSearch={handleSearch} />
        <Banner />
        {
          movieSearch.length > 0 ?
            <MovieSearch title={'Kết quả tìm kiếm'} data={movieSearch} /> :
            <>
              <MovieList title={'Phim Hot'} data={movie} />
              <MovieList title={'Phim Đề Cử'} data={movieRate} />
            </>
        }

      </div>
    </>
  )
}

export default App
