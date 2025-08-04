import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando nossas páginas e o novo componente de proteção
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Painel from './pages/Painel';
import RotaProtegida from './components/RotaProtegida'; // 1. Importamos o segurança

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        {/* 2. Envolvemos a rota do Painel com o nosso segurança */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <Painel />
            </RotaProtegida>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;