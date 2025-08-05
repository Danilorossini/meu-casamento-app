import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

function PublicPresentes() {
  const { userId } = useParams(); // Pega o ID do casal da URL
  const [dadosCasal, setDadosCasal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchDados = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setDadosCasal(docSnap.data());
        } else {
          setError('Lista de presentes não encontrada.');
        }
      } catch (err) {
        setError('Ocorreu um erro ao carregar as informações.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!dadosCasal) {
    return <div className="min-h-screen flex items-center justify-center">Lista não encontrada.</div>;
  }

  return (
    <div className="font-poppins bg-pink-50 text-gray-800 min-h-screen">
      {/* Cabeçalho Simples */}
      <header className="text-center py-12 px-6 bg-white shadow-md">
        <p className="text-lg text-gray-600 mb-2">Lista de Presentes de</p>
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-pink-800">
          {dadosCasal.nomeNoivo || 'Noivo'} & {dadosCasal.nomeNoiva || 'Noiva'}
        </h1>
      </header>
      
      {/* Seção da Lista de Presentes */}
      <main className="container mx-auto py-16 px-6">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dadosCasal.listaDePresentes && dadosCasal.listaDePresentes.map(presente => (
            <div key={presente.id} className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col">
              <div className="text-pink-500 mb-4">
                 {/* Ícone genérico de presente */}
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 11h14M5 19v-2a7 7 0 017-7v0a7 7 0 017 7v2H5z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 flex-grow">{presente.nome}</h3>
              <p className="text-lg text-gray-600 mb-4">R$ {presente.valor.toFixed(2).replace('.', ',')}</p>
              <button 
                onClick={() => alert('Funcionalidade de pagamento a ser implementada!')}
                className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700"
              >
                Presentear
              </button>
            </div>
          ))}
          {(!dadosCasal.listaDePresentes || dadosCasal.listaDePresentes.length === 0) && (
            <p className="col-span-full text-center text-gray-500">A lista de presentes ainda não foi criada pelo casal.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default PublicPresentes;