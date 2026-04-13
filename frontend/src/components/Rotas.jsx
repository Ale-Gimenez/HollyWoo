import {Route, Routes} from "react-router-dom";
import MovieList from "./MovieList";
import Movie from "./Movie";

export default function Rotas(){
    return(
        <Routes>
            <Route path="/" element={<MovieList />} />
            <Route path="/filme" element={<Movie />} />
        </Routes>
    )
}