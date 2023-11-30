import React from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Fuse from 'fuse.js';
const Main=()=> {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [pokeData,setPokeData]=useState([]);
    const [loading,setLoading]=useState(true);
    const [url,setUrl]=useState("https://pokeapi.co/api/v2/pokemon/")
    const [nextUrl,setNextUrl]=useState();
    const [prevUrl,setPrevUrl]=useState();
    const [pokeDex,setPokeDex]=useState();
    const codeSnippets = [
        { id: 1, title: 'Code Snippet 1', code: '...' },
        { id: 2, title: 'Code Snippet 2', code: '...' },
    ];
    const handleSearchInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
      
        if (query.trim() === '') {
          setSearchResults([]);
        } else {
          const fuse = new Fuse(codeSnippets, { keys: ['title', 'code'] });
          const results = fuse.search(query);
          setSearchResults(results.map((result) => result.item));
        }
    }

    const pokeFun=async()=>{
        setLoading(true)
        const res=await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results)
        setLoading(false)
    }
    const getPokemon=async(res)=>{
       res.map(async(item)=>{
          const result=await axios.get(item.url)
          setPokeData(state=>{
              state=[...state,result.data]
              state.sort((a,b)=>a.id>b.id?1:-1)
              return state;
          })
       })   
    }
    useEffect(()=>{
        pokeFun();
    }, [url])
    return(
        <>
            <div>
            <input
                type="text"
                placeholder="Search code snippets" class="serch_input"
                value={searchQuery}
                onChange={handleSearchInputChange}
            />
        
            {searchResults.map((snippet) => (
                <div key={snippet.id}>
                <h3>{snippet.title}</h3>
                <pre>{snippet.code}</pre>
                </div>
            ))}
            </div>
            <div className="container">
                <div className="left-content">
                    <input type="text" placeholder="Search Pokemon" class="serch_input" value />
                    <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                    <div className="btn-group">
                        {  prevUrl && <button onClick={()=>{
                            setPokeData([])
                           setUrl(prevUrl) 
                        }}>Previous</button>}

                        { nextUrl && <button onClick={()=>{
                            setPokeData([])
                            setUrl(nextUrl)
                        }}>Next</button>}

                    </div>
                </div>
                <div className="right-content">
                   <Pokeinfo data={pokeDex}/>
                </div>
            </div>
        </>
    )
}
export default Main;