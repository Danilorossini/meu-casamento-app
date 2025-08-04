import React, { useState } from 'react';
import { getFirestore, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import app from '../firebase';
// 1. Importamos o novo modal de confirmação
import ConfirmacaoModal from '../components/ConfirmacaoModal'; 

const db = getFirestore(app);

function PublicRSVP() {
  const [codigo, setCodigo] = useState('');
  const [familia, setFamilia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [etapa, setEtapa] = useState('buscar');

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
        // Adicionamos o userId aqui também, essencial para o modal
        const userId = doc.ref.parent.parent.id;
        setFamilia({ id: doc.id, userId, ...doc.data() });
        setEtapa('confirmar');
      }
    } catch (err) {
      console.error("Erro ao buscar convidado:", err);
      setError('Ocorreu um erro ao buscar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      {/* Etapa de Agradecimento (Agora é independente, não precisa do modal) */}
      {etapa === 'agradecimento' && (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center font-poppins">
          <h2 className="text-3xl font-playfair font-bold mb-4 text-green-600">Obrigado por confirmar!</h2>
          <p className="text-gray-600 mb-8 text-lg">Sua presença é o nosso maior presente! Mas, se desejar nos presentear, ficaremos muito felizes. Preparamos algumas opções com carinho.</p>
          <div className="border-t pt-8"><h3 className="text-2xl font-playfair mb-2">Lista de Presentes</h3><p className="text-gray-500 mb-6">Acesse nossa lista de presentes virtual.</p><a href="/" className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700">Acessar Lista</a></div>
        </div>
      )}
      
      {/* Etapa de Busca (continua a mesma) */}
      {etapa === 'buscar' && (
         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4 text-pink-800">Confirme sua Presença</h2>
            <p className="text-gray-600 mb-6">Por favor, digite o código de acesso que você recebeu no convite.</p>
            <form onSubmit={handleFindFamily}><input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-center font-mono uppercase tracking-widest" placeholder="SEU CÓDIGO AQUI" />{error && <p className="text-red-500 mt-2">{error}</p>}<button type="submit" disabled={loading} className="w-full mt-4 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 disabled:bg-pink-300">{loading ? 'Buscando...' : 'Encontrar Convite'}</button></form>
        </div>
      )}

      {/* 2. A etapa de confirmação agora chama nosso componente reutilizável */}
      {etapa === 'confirmar' && familia && (
        <ConfirmacaoModal 
          familia={familia} 
          onClose={() => setEtapa('buscar')} // Se cancelar, volta para a busca
          onSave={() => setEtapa('agradecimento')} // Se salvar, vai para o agradecimento
        />
      )}
    </div>
  );
}

export default PublicRSVP;