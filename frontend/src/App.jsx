import './App.css'
import MovieList from './components/MovieList';

function App() {

  return (
    <div className='container'>
      <header>
        <h1>Filminiis sz'</h1>
        <p>Seu catalogo de filmes favorito</p>
      </header>
      < MovieList />
    </div>
  )
}
export default App;
