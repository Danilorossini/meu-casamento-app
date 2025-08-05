import React, { useState } from 'react';
// 1. Importamos o Link para criar uma navegação inteligente
import { Link } from 'react-router-dom';
import { getFirestore, collectionGroup, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

function PublicRSVP() {
  const [codigo, setCodigo] = useState('');
  const [familia, setFamilia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [etapa, setEtapa] = useState('buscar');
  
  const [confirmacoes, setConfirmacoes] = useState({});
  const [nomesCompletos, setNomesCompletos] = useState({});

  const handleFindFamily = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFamilia(null);

    const q = query(collectionGroup(db, 'convidados'), where('codigo', '==', codigo.toUpperCase()));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('Código não encontrado. Por favor, verifique o código no seu convite.');
      } else {
        const doc = querySnapshot.docs[0];
        const familiaData = doc.data();
        const userId = doc.ref.parent.parent.id; // Pegamos o ID do casal dono da lista

        setFamilia({ id: doc.id, path: doc.ref.path, userId, ...familiaData });
        
        const initialConfirmations = {};
        const initialNomes = {};
        familiaData.integrantes.forEach((p, index) => {
          initialConfirmations[index] = p.status === 'Confirmado';
          initialNomes[index] = p.status === 'Confirmado' ? p.nome : '';
        });
        setConfirmacoes(initialConfirmations);
        setNomesCompletos(initialNomes);
        setEtapa('confirmar');
      }
    } catch (err) {
      console.error("Erro ao buscar convidado:", err);
      setError('Ocorreu um erro ao buscar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmacaoChange = (index) => {
    setConfirmacoes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNomeCompletoChange = (index, nome) => {
    setNomesCompletos(prev => ({ ...prev, [index]: nome }));
  };

  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    setError('');

    for (let i = 0; i < familia.integrantes.length; i++) {
      if (confirmacoes[i] && (!nomesCompletos[i] || nomesCompletos[i].trim() === '')) {
        setError('Por favor, preencha o nome completo de todos os convidados confirmados.');
        return;
      }
    }

    setLoading(true);

    const integrantesAtualizados = familia.integrantes.map((integrante, index) => {
      const isConfirmado = confirmacoes[index];
      return {
        ...integrante,
        nome: isConfirmado ? nomesCompletos[index].trim() : integrante.nome,
        status: isConfirmado ? 'Confirmado' : 'Recusado'
      };
    });

    const docRef = doc(db, familia.path);

    try {
      await updateDoc(docRef, { integrantes: integrantesAtualizados });
      setEtapa('agradecimento');
    } catch (err) {
      console.error("Erro ao confirmar presença:", err);
      setError('Ocorreu um erro ao salvar sua resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        
        {etapa === 'buscar' && (
          // ... (código da etapa de busca não mudou)
          <><h2 className="text-3xl font-playfair font-bold mb-4 text-pink-800">Confirme sua Presença</h2><p className="text-gray-600 mb-6">Por favor, digite o código de acesso que você recebeu no convite.</p><form onSubmit={handleFindFamily}><input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-center font-mono uppercase tracking-widest" placeholder="SEU CÓDIGO AQUI" />{error && <p className="text-red-500 mt-2">{error}</p>}<button type="submit" disabled={loading} className="w-full mt-4 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 disabled:bg-pink-300">{loading ? 'Buscando...' : 'Encontrar Convite'}</button></form></>
        )}

        {etapa === 'confirmar' && familia && (
          // ... (código da etapa de confirmação não mudou)
          <><h2 className="text-3xl font-playfair font-bold mb-2 text-pink-800">Bem-vinda, {familia.nomeFamilia}!</h2><p className="text-gray-600 mb-6">Marque quem comparecerá e preencha o nome completo para a lista de convidados.</p><form onSubmit={handleSubmitRsvp}><div className="space-y-4 text-left border-t border-b py-4">{familia.integrantes.map((integrante, index) => (<div key={index} className="p-3 rounded-lg hover:bg-pink-50"><label className="flex items-center cursor-pointer"><input type="checkbox" checked={confirmacoes[index] || false} onChange={() => handleConfirmacaoChange(index)} className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-500" /><span className="ml-4 text-lg text-gray-700">{integrante.nome}</span></label>{confirmacoes[index] && (<div className="mt-2 ml-10"><label className="text-sm text-gray-500">Nome completo para a lista</label><input type="text" value={nomesCompletos[index] || ''} onChange={(e) => handleNomeCompletoChange(index, e.target.value)} className="w-full px-3 py-1 mt-1 border rounded-md text-sm" placeholder="Digite o nome completo aqui" /></div>)}</div>))}</div>{error && <p className="text-red-500 text-center mt-4">{error}</p>}<button type="submit" disabled={loading} className="w-full mt-6 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300">{loading ? 'Confirmando...' : 'Confirmar Presença'}</button></form></>
        )}

        {etapa === 'agradecimento' && (
          <div className="font-poppins">
            <h2 className="text-3xl font-playfair font-bold mb-4 text-green-600">Obrigado por confirmar!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sua presença é o nosso maior presente! Mas, se desejar nos presentear, ficaremos muito felizes. Preparamos algumas opções com carinho.
            </p>
            <div className="border-t pt-8">
              <h3 className="text-2xl font-playfair mb-2">Lista de Presentes</h3>
              <p className="text-gray-500 mb-6">Acesse nossa lista de presentes virtual.</p>
              {/* --- 2. MUDANÇA NO BOTÃO --- */}
              {/* Agora ele usa o Link para criar um link dinâmico para a página de presentes do casal certo */}
              <Link to={`/presentes/${familia.userId}`} className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700">
                Acessar Lista
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PublicRSVP;