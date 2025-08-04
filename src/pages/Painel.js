import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);

function Painel() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // ----- ESTA É A VERSÃO FINAL E CORRIGIDA DA FUNÇÃO -----
  const handleLogout = () => {
    // 1. PRIMEIRO, manda o usuário para a página de vendas, que é pública.
    navigate('/');
    
    // 2. SÓ DEPOIS, executa o logout em segundo plano.
    // Quando o logout terminar, o usuário já estará em uma página segura e pública.
    signOut(auth).catch((error) => {
      // Adicionamos um .catch aqui para o caso de algum erro raro no logout
      console.error("Erro ao fazer logout:", error);
    });
  };
  
  if (!user) {
    return <div>Carregando informações do usuário...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo ao seu Painel!
        </h1>
        <p className="mt-4 text-lg">Logado como: <strong>{user.email}</strong></p>
        
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
        >
          Sair (Logout)
        </button>
      </div>
    </div>
  );
}

export default Painel;