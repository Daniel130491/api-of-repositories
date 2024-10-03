import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from '../Pages/Main/indexMain';
import Repositorio from '../Pages/Repositorios/indexRepositorios';


export default function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Main}/>
                <Route path='/repositorio/:repositorio' Component={Repositorio}/>
            </Routes>
        </BrowserRouter>
    )
}
