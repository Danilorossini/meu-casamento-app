import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando componentes e páginas
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import RotaProtegida from './components/RotaProtegida';
import PublicRSVP from './pages/PublicRSVP'; // 1. Importamos a nova página

// Importando o layout do painel e as sub-páginas
import PainelLayout from './pages/PainelLayout';
import InformacoesGerais from './pages/InformacoesGerais';
import ListaDePresentes from './pages/ListaDePresentes';
import RSVP from './pages/RSVP';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rsvp" element={<PublicRSVP />} /> {/* 2. Adicionamos a nova rota pública */}

        {/* --- ROTA PRIVADA DO PAINEL --- */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <PainelLayout />
            </RotaProtegida>
          } 
        >
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<InformacoesGerais />} />
          <Route path="presentes" element={<ListaDePresentes />} />
          <Route path="rsvp" element={<RSVP />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;