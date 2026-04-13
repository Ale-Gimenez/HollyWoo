const API_URL = import.meta.env.VITE_API_URL;

// Chamada básica de json
export async function getMovies(){
    try{
        const resposta = await fetch(`${API_URL}/listagem`)
        if(!resposta.ok){
            throw new Error("Erro ao buscar filmes");
        }

        const dados = await resposta.json();
        return dados;
    } catch(erro){
        console.eror("Erro na API:", erro);
        return[];  //Retornando nada para nossa interface não bugar no front
    }
}

export async function getDetails(id){
    try{
        const resposta = await fetch(`${API_URL}/filme?id=${id}`) //? fala pro back que a partir de agora estou pegando parâmetros, nesse caso o id
        if(!resposta.ok){
            throw new Error("Erro ao buscar filme");
        }

        const dados = await resposta.json()
        return dados;
    } catch(erro){
        console.error("Erro na API: ", erro);
        return[];
    }
} 