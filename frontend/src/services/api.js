const API_URL = import.meta.env.VITE_API_URL;

// Chamada básica de json
export async function getMovies(){
    const response = await fetch("filmes.json"); //só se estiver no public

    if(!response.ok){
        throw new Error("Erro ao buscar filmes");
    }

    return response.json();
}