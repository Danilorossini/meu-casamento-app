import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importando as ferramentas de autenticação do Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../firebase'; // Nosso app Firebase que configuramos

function Cadastro() {
  // Estados para guardar os dados do formulário e mensagens
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Para guardar mensagens de erro
  const [loading, setLoading] = useState(false); // Para mostrar que está carregando

  const navigate = useNavigate(); // Ferramenta para redirecionar o usuário

  // Função que será chamada ao clicar no botão "Criar Conta"
  const handleCadastro = async (e) => {
    e.preventDefault(); // Impede que a página recarregue
    setError(''); // Limpa erros antigos
    setLoading(true); // Começa o carregamento

    const auth = getAuth(app); // Pega a instância da autenticação

    try {
      // Tenta criar o usuário no Firebase com o email e senha
      await createUserWithEmailAndPassword(auth, email, password);

      alert('Conta criada com sucesso! Redirecionando para o painel...');
      navigate('/painel'); // Redireciona para o painel se der certo

    } catch (err) {
      // Se der erro, captura e mostra uma mensagem amigável
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha precisa ter no mínimo 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      }
      console.error("Erro no cadastro:", err); // Mostra o erro técnico no console
    } finally {
      setLoading(false); // Termina o carregamento, dando erro ou sucesso
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-center mb-6 text-pink-800">
          Criar sua Conta
        </h2>
        <form onSubmit={handleCadastro}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email} // Conecta o campo ao estado
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
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
              value={password} // Conecta o campo ao estado
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          {/* Mostra a mensagem de erro, se houver */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
            disabled={loading} // Desabilita o botão enquanto carrega
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-gray-600">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-pink-600 hover:underline font-semibold">
          Faça Login
        </Link>
      </p>
    </div>
  );
}

export default Cadastro;