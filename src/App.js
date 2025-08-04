import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando componentes e páginas
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import RotaProtegida from './components/RotaProtegida';

// Importando o NOVO layout do painel e as sub-páginas com os nomes corretos
import PainelLayout from './pages/PainelLayout';
import InformacoesGerais from './pages/InformacoesGerais';
import ListaDePresentes from './pages/ListaDePresentes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rota principal do Painel, protegida e usando o novo Layout */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <PainelLayout />
            </RotaProtegida>
          } 
        >
          {/* Rotas "filhas" do painel. Elas serão renderizadas dentro do <Outlet /> */}
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<InformacoesGerais />} />
          <Route path="presentes" element={<ListaDePresentes />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;