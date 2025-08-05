import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import PublicRSVP from './pages/PublicRSVP';
import RotaProtegida from './components/RotaProtegida';
import SiteCasamento from './pages/SiteCasamento';
import PublicPresentes from './pages/PublicPresentes';

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
        <Route path="/rsvp" element={<PublicRSVP />} />
        <Route path="/casamento/:userId" element={<SiteCasamento />} />
        <Route path="/presentes/:userId" element={<PublicPresentes />} />
        
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