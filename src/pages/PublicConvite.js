import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

function PublicConvite() {
  const { userId } = useParams();
  const [dadosCasamento, setDadosCasamento] = useState(null);
  const [loading, setLoading] = useState(true);

  // No useEffect, removemos o setError pois a verificação final cuidará disso
  useEffect(() => {
    if (userId) {
      const fetchDados = async () => {
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setDadosCasamento(docSnap.data());
        }
        setLoading(false);
      };
      fetchDados();
    }
  }, [userId]);
  
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString + 'T00:00:00-03:00');
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50">Carregando...</div>;
  }

  // --- ESTA É A NOVA "TRAVA DE SEGURANÇA" ---
  // Se não estiver mais carregando, mas os dados não chegaram (ou o documento não existe), mostra um erro.
  if (!dadosCasamento) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50">Convite não encontrado ou inválido.</div>;
  }

  // A partir daqui, temos certeza que "dadosCasamento" é um objeto com dados.
  const imagemDeFundo = (dadosCasamento.conviteImageSource === 'nova' && dadosCasamento.conviteImageUrl)
    ? dadosCasamento.conviteImageUrl
    : dadosCasamento.imageUrl || 'https://images.unsplash.com/photo-1523438885239-c1b3f525f8e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80';

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8 text-center text-white" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imagemDeFundo})`,
      }}
    >
      <div className="bg-black bg-opacity-30 p-8 rounded-lg backdrop-blur-sm">
        <p className="font-light tracking-widest text-lg">VOCÊ ESTÁ CONVIDADO PARA O CASAMENTO DE</p>
        <h1 className="text-6xl md:text-8xl font-playfair my-6">
          {dadosCasamento.nomeNoivo || 'Noivo'}
          <span className="block text-4xl my-2">&</span>
          {dadosCasamento.nomeNoiva || 'Noiva'}
        </h1>
        <div className="border-y border-white border-opacity-50 py-4 my-6">
          <p className="text-2xl font-light">{formatarData(dadosCasamento.dataCasamento)}</p>
          <p className="text-lg mt-1">{dadosCasamento.horarioCerimonia ? `às ${dadosCasamento.horarioCerimonia}` : ''}</p>
          <p className="text-lg mt-2 font-semibold">{dadosCasamento.localCerimonia || 'Local a definir'}</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <Link to={`/casamento/${userId}`} className="w-full md:w-auto border border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition-colors">
            Ver Site Completo
          </Link>
          <Link to="/rsvp" className="w-full md:w-auto bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-colors">
            Confirmar Presença
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicConvite;