import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

function ListaDePresentes() {
  const [user] = useAuthState(auth);

  const [presentes, setPresentes] = useState([]);
  const [nomePresente, setNomePresente] = useState('');
  const [valorPresente, setValorPresente] = useState('');

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const fetchData = async () => {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setPresentes(docSnap.data().listaDePresentes || []);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleAddPresente = async (e) => {
    e.preventDefault();
    if (!nomePresente || !valorPresente) {
      alert('Por favor, preencha o nome e o valor do presente.');
      return;
    }
    const novoPresente = { id: Date.now(), nome: nomePresente, valor: parseFloat(valorPresente) };
    const novaLista = [...presentes, novoPresente];
    setPresentes(novaLista);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { listaDePresentes: novaLista }, { merge: true });
    setNomePresente('');
    setValorPresente('');
  };

  const handleDeletePresente = async (idParaDeletar) => {
    const confirmar = window.confirm("Você tem certeza que deseja excluir este presente?");
    if (confirmar) {
      const novaLista = presentes.filter(p => p.id !== idParaDeletar);
      setPresentes(novaLista);
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { listaDePresentes: novaLista }, { merge: true });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Gerenciar Lista de Presentes</h2>
      <form onSubmit={handleAddPresente} className="flex items-end gap-4 mb-6">
        <div className="flex-grow">
          <label htmlFor="nomePresente" className="block text-gray-700 font-semibold mb-2">Nome do Presente</label>
          <input type="text" id="nomePresente" value={nomePresente} onChange={(e) => setNomePresente(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Jantar Romântico" />
        </div>
        <div>
          <label htmlFor="valorPresente" className="block text-gray-700 font-semibold mb-2">Valor (R$)</label>
          <input type="number" id="valorPresente" value={valorPresente} onChange={(e) => setValorPresente(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: 250" />
        </div>
        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Adicionar</button>
      </form>
      <div>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Seus Presentes</h3>
        {presentes.length === 0 ? (
          <p className="text-gray-500">Nenhum presente adicionado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {presentes.map((presente) => (
              <li key={presente.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{presente.nome} - R$ {presente.valor}</span>
                <button onClick={() => handleDeletePresente(presente.id)} className="text-red-500 hover:text-red-700 font-bold">X</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ListaDePresentes;