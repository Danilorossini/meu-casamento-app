import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

function InformacoesGerais() {
  const [user] = useAuthState(auth);

  const [nomeNoivo, setNomeNoivo] = useState('');
  const [nomeNoiva, setNomeNoiva] = useState('');
  const [dataCasamento, setDataCasamento] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const fetchData = async () => {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNomeNoivo(data.nomeNoivo || '');
          setNomeNoiva(data.nomeNoiva || '');
          setDataCasamento(data.dataCasamento || '');
        }
      };
      fetchData();
    }
  }, [user]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setMensagem('Salvando...');
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, { nomeNoivo, nomeNoiva, dataCasamento }, { merge: true });
      setMensagem('Informações salvas com sucesso!');
    } catch (error) {
      setMensagem('Erro ao salvar as informações.');
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Informações do Casamento</h2>
      <form onSubmit={handleSaveInfo}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="nomeNoivo" className="block text-gray-700 font-semibold mb-2">Nome do Noivo</label>
            <input type="text" id="nomeNoivo" value={nomeNoivo} onChange={(e) => setNomeNoivo(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="nomeNoiva" className="block text-gray-700 font-semibold mb-2">Nome da Noiva</label>
            <input type="text" id="nomeNoiva" value={nomeNoiva} onChange={(e) => setNomeNoiva(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="dataCasamento" className="block text-gray-700 font-semibold mb-2">Data do Casamento</label>
          <input type="date" id="dataCasamento" value={dataCasamento} onChange={(e) => setDataCasamento(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">Salvar Informações</button>
        {mensagem && <p className="text-center mt-4 text-green-600">{mensagem}</p>}
      </form>
    </div>
  );
}

export default InformacoesGerais;