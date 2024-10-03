import { useCallback, useEffect, useState } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from "react-icons/fa6";
import { Container, DeleteButton, Form, List, SubmitButton } from "./styleMain";
import { api } from "../../Services/api";
import { Link } from "react-router-dom";

export default function Main(){

    const [neoRepo, setNeoRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //DidMount
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');

        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    },[])

    //DidUpdate
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios));
    },[repositorios]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();//para nao ocorrer refresh quando clicar
        
        async function submit() {
            setLoading(true);
            setAlert(null);
            try {
                if (neoRepo === '') {
                    throw new Error("Você precisa adicionar um repositório válido!");
                }

                const response = await api.get(`repos/${neoRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === neoRepo);

                if (hasRepo) {
                    throw new Error("Repositorio Duplicado!");
                }
    
                const data = {
                    name: response.data.full_name,
                }
        
                setRepositorios([...repositorios, data]);
                setNeoRepo('');
            } catch (error) {
                setAlert(true);
                console.log(error)
            } finally{
                setLoading(false)
            }

        }

        submit();
    }, [neoRepo, repositorios]);

    function handleinputChange(e){
        setNeoRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find)
    }, [repositorios])

    return(
        <>
            <Container>
                <h1>
                    <FaGithub size={25}/>
                    Meus Repositórios
                </h1>

                <Form onSubmit={handleSubmit} error={alert}>
                    <input 
                    name="form" 
                    type="text" 
                    placeholder="Adicionar Repositorios" 
                    value={neoRepo}
                    onChange={handleinputChange}
                    />
                    
                    <SubmitButton loading={loading ? 1 : 0}>
                        {
                            loading ? (
                                <FaSpinner color="#fff" size={14}/>
                            ) : (
                                <FaPlus color="#fff" size={14}/>
                            )
                        }    
                    </SubmitButton> 
                </Form>
                <List>
                    {repositorios.map(repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={()=> handleDelete(repo.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                                <FaBars size={20}/>
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        </>
    )
}
