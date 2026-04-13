import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Rotas from './components/Rotas';

function App() {

  return (
    <BrowserRouter>
    <div className='container'>
      <header>
        <h1>Filminiis sz'</h1>
        <p>Seu catalogo de filmes favorito</p>
      </header>
      <Rotas />
    </div>
    </BrowserRouter>
  )
}
export default App;
