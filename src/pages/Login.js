import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importando as ferramentas de autenticação do Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase';

function Login() {
  // Estados para guardar os dados do formulário e mensagens
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Ferramenta para redirecionar o usuário

  // Função que será chamada ao clicar no botão "Entrar"
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const auth = getAuth(app);

    try {
      // Tenta FAZER LOGIN com o email e senha
      await signInWithEmailAndPassword(auth, email, password);
      
      // Se der certo, redireciona para o painel
      navigate('/painel'); 

    } catch (err) {
      // Se der erro, captura e mostra uma mensagem amigável
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-center mb-6 text-pink-800">
          Acessar sua Conta
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="senha" className="block text-gray-700 font-semibold mb-2">Senha</label>
            <input
              type="password"
              id="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Sua senha"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-gray-600">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-pink-600 hover:underline font-semibold">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default Login;