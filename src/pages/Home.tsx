import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
interface Movie {
  id: string;
  name: string;
  previewImage: string;
  url: string;
  subtitles?: string;
}

function Home() {
  const [moviesData, setMoviesData] = useState<{ movies: Movie[] } | null>(null);

  useEffect(() => {
    // Set movies data directly from the imported JSON file
    fetch('https://raw.githubusercontent.com/zeankundev/cdn/main/ota-update.json')
    .then(res => res.json())
    .then(data => {
      setMoviesData(data);
    })
    
  }, []);
  if (!moviesData) {
    // Data not loaded yet
    return null;
  }

  const { movies } = moviesData;
  return (
    <div>
      <h1>Recommended for you</h1>
      <div className='lkui-movies'>
        {movies.map((movie: Movie) => (
          <Link to={`/player/${movie.id}`} className='lkui-movie-select'>
            <div key={movie.id}>
              <img src={movie.previewImage} width={1280} height={720} className='lkui-image-preview'></img>
              <span>{movie.name.slice(0, 25) + (movie.name.length > 25 ? '...' : '')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
