import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { Navigate } from 'react-router-dom';

const auth = getAuth(app);

// Este componente recebe uma "criança" (a página que ele deve proteger)
function RotaProtegida({ children }) {
  const [user, loading] = useAuthState(auth);

  // Se ainda estiver carregando a informação de login, mostra uma mensagem
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não houver usuário logado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se houver um usuário logado, mostra a página protegida
  return children;
}

export default RotaProtegida;