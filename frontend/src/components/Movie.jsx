import { useEffect, useState } from "react";
import { getDetails } from "../services/api";
import { useSearchParams } from "react-router-dom";

export default function Movie(){
    const [searchParams] = useSearchParams(); //aqui pegamos o id que está no routes
    const id = searchParams.get("id");

    const [filme, setFilme] = useState(null);
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function carregarFilme(){
            try{
                setLoading(true); //garantindo que etá setando para true
                setErro(""); // o mesmo de cima para o erro

                const dados = await getDetails(id);

                if(!dados){
                    throw new Erro("Filme não encontrado")
                }

                setFilme(dados);
            } catch(err){
                setErro(err.message);
            } finally {
                setLoading(false)
            }
        }

        if(id){
            carregarFilme();
        }
    } , [id]); // deixamos o id, porque se o id tem alguma alteração, esse useEfect é alterado também
    if(loading){
        return <p>Carregando filme...</p>
    }

    if(erro){
        return <p>Erro: {erro}</p>
    }

    if(!filme){
        return <p>Nenhum filme para exibir.</p>
    }

    return(
        <main>
            <h1>{filme.titulo}</h1>

            <p>Ano: {filme.ano}</p>
            <p>Duração: {filme.duracao}</p>
            
            <figure>
                <img src={filme.poster} alt={`Poster do filme ${filme.titulo}`} />
            </figure>

            <section>
                <h2>Categorias</h2>
                <ul>
                    {filme.categorias.map((cat)=>(
                        <li>{cat}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Atores</h2>
                <ul>
                    {filme.atores.map((ator)=>(
                        <li>{ator.nome} {ator.sobrenome}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Diretores</h2>
                <ul>
                    {filme.diretores.map((dir)=>(
                        <li>{dir.nome} {dir.sobrenome}</li>
                    ))}
                </ul>
            </section>
        </main>
    )
}