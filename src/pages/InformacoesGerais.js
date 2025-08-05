import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

function InformacoesGerais() {
  const [user] = useAuthState(auth);

  // Estados que já tínhamos
  const [nomeNoivo, setNomeNoivo] = useState('');
  const [nomeNoiva, setNomeNoiva] = useState('');
  const [dataCasamento, setDataCasamento] = useState('');
  
  // --- NOVOS ESTADOS PARA AS NOVAS INFORMAÇÕES ---
  const [horarioCerimonia, setHorarioCerimonia] = useState('');
  const [localCerimonia, setLocalCerimonia] = useState('');
  const [mensagemCasal, setMensagemCasal] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // useEffect agora busca os novos campos também
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
          setHorarioCerimonia(data.horarioCerimonia || '');
          setLocalCerimonia(data.localCerimonia || '');
          setMensagemCasal(data.mensagemCasal || '');
        }
      };
      fetchData();
    }
  }, [user]);

  // handleSaveInfo agora salva os novos campos também
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setMensagem('Salvando...');
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, { 
        nomeNoivo, 
        nomeNoiva, 
        dataCasamento,
        horarioCerimonia,
        localCerimonia,
        mensagemCasal,
      }, { merge: true });
      setMensagem('Informações salvas com sucesso!');
    } catch (error) {
      setMensagem('Erro ao salvar as informações.');
      console.error("Erro ao salvar no Firestore:", error);
    }
  };
  
  const copyToClipboard = () => {
    const link = `${window.location.origin}/casamento/${user.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess('Link copiado para a área de transferência!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      console.error('Erro ao copiar link: ', err);
      setCopySuccess('Falha ao copiar o link.');
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Informações do Casamento</h2>
        <form onSubmit={handleSaveInfo} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label htmlFor="nomeNoivo" className="block text-gray-700 font-semibold mb-2">Nome do Noivo</label><input type="text" id="nomeNoivo" value={nomeNoivo} onChange={(e) => setNomeNoivo(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label htmlFor="nomeNoiva" className="block text-gray-700 font-semibold mb-2">Nome da Noiva</label><input type="text" id="nomeNoiva" value={nomeNoiva} onChange={(e) => setNomeNoiva(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div>
            <label htmlFor="mensagemCasal" className="block text-gray-700 font-semibold mb-2">Mensagem de Boas-vindas</label>
            <textarea id="mensagemCasal" value={mensagemCasal} onChange={(e) => setMensagemCasal(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="3" placeholder="Escreva uma mensagem carinhosa para seus convidados..."></textarea>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label htmlFor="dataCasamento" className="block text-gray-700 font-semibold mb-2">Data do Casamento</label><input type="date" id="dataCasamento" value={dataCasamento} onChange={(e) => setDataCasamento(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label htmlFor="horarioCerimonia" className="block text-gray-700 font-semibold mb-2">Horário da Cerimônia</label><input type="time" id="horarioCerimonia" value={horarioCerimonia} onChange={(e) => setHorarioCerimonia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div>
            <label htmlFor="localCerimonia" className="block text-gray-700 font-semibold mb-2">Local da Cerimônia e Festa</label>
            <input type="text" id="localCerimonia" value={localCerimonia} onChange={(e) => setLocalCerimonia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Sítio Meio do Mato, Rio de Janeiro" />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">Salvar Informações</button>
          {mensagem && <p className="text-center mt-4 text-green-600">{mensagem}</p>}
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-playfair font-bold mb-4 text-pink-800">Link do seu Site</h2>
        <p className="text-gray-600 mb-4">Compartilhe este link com seus convidados.</p>
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
          <input type="text" readOnly value={`${window.location.origin}/casamento/${user?.uid}`} className="w-full bg-transparent outline-none text-gray-700" />
          <button onClick={copyToClipboard} className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 flex-shrink-0">Copiar Link</button>
        </div>
        {copySuccess && <p className="text-center mt-3 text-green-600 text-sm">{copySuccess}</p>}
      </div>
    </div>
  );
}

export default InformacoesGerais;