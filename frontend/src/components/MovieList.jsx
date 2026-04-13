import { getMovies } from "../services/api";
import { useEffect, useState } from "react";
import './MovieList.css'
import { Link } from "react-router-dom";

export default function MovieList(){
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMovies(){
            try{
                const data = await getMovies();
                setMovies(data);
            } catch {
                setError("Não foi possível carregar os filmes")
            } finally {
                setLoading(false)
            }
        }
        loadMovies();
    }, []); //aqui colocamos a variável que o use Efect usa para atualizar o useEfect
    if(loading) return <p className="status"> Carregando filmes... </p>;
    if (error) return <p className="status error">{error}</p>

    return(
        <section className="movie-section">
            <h2>Catálogo de Filmes e Séries</h2>

            <div className="movie-grid">
                {movies.map((movie) => (
                    <article key={movie.id} className="movie-card">
                        <Link to={`/filme?id=${movie.id}`}>
                            <img src ={movie.imagem} alt={`poster do filme ${movie.titulo}`} />
                            <div className="movie-info">
                                <h3>{movie.titulo}</h3>
                                <p>{movie.ano}</p>
                                <span>{movie.categorias}</span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

        </section>
    )
}