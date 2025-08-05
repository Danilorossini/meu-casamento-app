import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

function PixModal({ chavePix, onClose }) {
  const [copySuccess, setCopySuccess] = useState('');
  const copyToClipboard = () => {
    navigator.clipboard.writeText(chavePix).then(() => {
      setCopySuccess('Chave PIX copiada!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-playfair font-bold mb-4 text-pink-800">Presentear via PIX</h2>
        <p className="text-gray-600 mb-4">Para presentear o casal, utilize a chave PIX abaixo no seu aplicativo do banco.</p>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
          <input type="text" readOnly value={chavePix} className="w-full bg-transparent outline-none text-gray-700 font-mono"/>
          <button onClick={copyToClipboard} className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 flex-shrink-0">Copiar</button>
        </div>
        {copySuccess && <p className="mt-3 text-green-600 text-sm">{copySuccess}</p>}
        <button onClick={onClose} className="mt-6 w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300">Fechar</button>
      </div>
    </div>
  );
}

function PublicPresentes() {
  const { userId } = useParams();
  const [dadosCasal, setDadosCasal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);

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

  if (loading) { return <div className="min-h-screen flex items-center justify-center">Carregando...</div>; }
  if (error) { return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>; }
  if (!dadosCasal) { return <div className="min-h-screen flex items-center justify-center">Lista não encontrada ou dados indisponíveis.</div>; }

  return (
    <div className="font-poppins bg-pink-50 text-gray-800 min-h-screen">
      <header className="text-center py-12 px-6 bg-white shadow-md">
        <p className="text-lg text-gray-600 mb-2">Lista de Presentes de</p>
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-pink-800">{dadosCasal.nomeNoivo || 'Noivo'} & {dadosCasal.nomeNoiva || 'Noiva'}</h1>
      </header>
      
      <main className="container mx-auto py-16 px-6">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dadosCasal.listaDePresentes && dadosCasal.listaDePresentes.map(presente => (
            <div key={presente.id} className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col">
              <div className="text-pink-500 mb-4"><svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 11h14M5 19v-2a7 7 0 017-7v0a7 7 0 017 7v2H5z"></path></svg></div>
              <h3 className="text-xl font-semibold mb-2 flex-grow">{presente.nome}</h3>
              <p className="text-lg text-gray-600 mb-4">R$ {presente.valor.toFixed(2).replace('.', ',')}</p>
              <button onClick={() => setIsPixModalOpen(true)} disabled={!dadosCasal.chavePix} className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Presentear</button>
            </div>
          ))}
          {(!dadosCasal.listaDePresentes || dadosCasal.listaDePresentes.length === 0) && (<p className="col-span-full text-center text-gray-500">A lista de presentes ainda não foi criada pelo casal.</p>)}
        </div>
      </main>

      {isPixModalOpen && dadosCasal.chavePix && (
        <PixModal 
          chavePix={dadosCasal.chavePix} 
          onClose={() => setIsPixModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default PublicPresentes;