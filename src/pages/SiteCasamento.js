import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// CORREÇÃO: Removido o 'updateDoc' que não estava sendo usado.
import { getFirestore, doc, getDoc, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import app from '../firebase';
import ConfirmacaoModal from '../components/ConfirmacaoModal';

const db = getFirestore(app);

// Componente do Modal PIX
function PixModal({ chavePix, onClose, colors }) {
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
        <h2 className={`text-2xl font-playfair font-bold mb-4 ${colors.text}`}>Presentear via PIX</h2>
        <p className="text-gray-600 mb-4">Para presentear o casal, utilize a chave PIX abaixo.</p>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
          <input type="text" readOnly value={chavePix} className="w-full bg-transparent outline-none text-gray-700 font-mono"/>
          <button onClick={copyToClipboard} className={`text-white font-semibold py-2 px-4 rounded-lg ${colors.bg} ${colors.hoverBg}`}>Copiar</button>
        </div>
        {copySuccess && <p className="mt-3 text-green-600 text-sm">{copySuccess}</p>}
        <button onClick={onClose} className="mt-6 w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300">Fechar</button>
      </div>
    </div>
  );
}

const themeColors = {
  'theme-rose': { text: 'text-rose-800', bg: 'bg-rose-600', hoverBg: 'hover:bg-rose-700', accent: 'accent-rose-600' },
  'theme-sky': { text: 'text-sky-800', bg: 'bg-sky-600', hoverBg: 'hover:bg-sky-700', accent: 'accent-sky-600' },
  'theme-emerald': { text: 'text-emerald-800', bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700', accent: 'accent-emerald-600' },
  'theme-amber': { text: 'text-amber-800', bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-700', accent: 'accent-amber-600' },
};

function SiteCasamento() {
  const { userId } = useParams();
  const [dadosCasamento, setDadosCasamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tempoRestante, setTempoRestante] = useState({});
  const [codigo, setCodigo] = useState('');
  const [familia, setFamilia] = useState(null);
  const [loadingRsvp, setLoadingRsvp] = useState(false);
  const [errorRsvp, setErrorRsvp] = useState('');
  const [etapaRsvp, setEtapaRsvp] = useState('buscar');
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchDados = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setDadosCasamento(docSnap.data());
        } else {
          setError('Site não encontrado.');
        }
      } catch (err) {
        setError('Ocorreu um erro ao carregar as informações.');
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, [userId]);
  
  useEffect(() => {
    if (!dadosCasamento || !dadosCasamento.dataCasamento) return;
    const dataAlvo = new Date(`${dadosCasamento.dataCasamento}T${dadosCasamento.horarioCerimonia || '00:00:00'}`);
    const intervalId = setInterval(() => {
      const agora = new Date();
      const diferenca = dataAlvo - agora;
      if (diferenca > 0) {
        setTempoRestante({
          dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferenca / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((diferenca / 1000 / 60) % 60),
          segundos: Math.floor((diferenca / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [dadosCasamento]);

  const handleFindFamily = async (e) => {
    e.preventDefault();
    setLoadingRsvp(true);
    setErrorRsvp('');
    setFamilia(null);
    const q = query(collectionGroup(db, 'convidados'), where('codigo', '==', codigo.toUpperCase()), where('__name__', '>=', `users/${userId}/`), where('__name__', '<', `users/${userId}\uf8ff`));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErrorRsvp('Código não encontrado ou não pertence a este casamento.');
      } else {
        const docFound = querySnapshot.docs[0];
        const familiaData = docFound.data();
        setFamilia({ id: docFound.id, path: docFound.ref.path, userId, ...familiaData });
        setEtapaRsvp('confirmar');
      }
    } catch (err) {
      setErrorRsvp('Ocorreu um erro ao buscar.');
    } finally {
      setLoadingRsvp(false);
    }
  };

  if (loading) { return <div className="min-h-screen flex items-center justify-center">Carregando...</div>; }
  if (error) { return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>; }
  if (!dadosCasamento) { return <div className="min-h-screen flex items-center justify-center">Site não encontrado.</div>; }
  
  const colors = themeColors[dadosCasamento.themeColor] || themeColors['theme-rose'];
  const formatarData = (dataString) => { if (!dataString) return ''; const data = new Date(dataString + 'T00:00:00-03:00'); return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); };

  return (
    <div className="font-poppins bg-gray-50 text-gray-800">
       <header className="text-center py-20 px-6 bg-white shadow-md bg-cover bg-center" style={{ backgroundImage: `url(${dadosCasamento.imageUrl})` }}>
        <div className="bg-black bg-opacity-40 py-10 px-4 rounded-lg inline-block">
          <p className="text-lg text-white mb-2">Com a benção de Deus e de nossos pais, nós convidamos você para celebrar o nosso amor.</p>
          <h1 className={`text-5xl md:text-7xl font-playfair font-bold text-white mt-4`}>{dadosCasamento.nomeNoivo || 'Noivo'} & {dadosCasamento.nomeNoiva || 'Noiva'}</h1>
          <p className="text-2xl font-playfair text-white mt-4">{formatarData(dadosCasamento.dataCasamento)}</p>
          <div className="flex justify-center gap-4 md:gap-8 mt-8 text-white">
            <div className="text-center"><p className="text-4xl font-bold">{tempoRestante.dias || 0}</p><p className="text-sm">dias</p></div>
            <div className="text-center"><p className="text-4xl font-bold">{tempoRestante.horas || 0}</p><p className="text-sm">horas</p></div>
            <div className="text-center"><p className="text-4xl font-bold">{tempoRestante.minutos || 0}</p><p className="text-sm">minutos</p></div>
            <div className="text-center"><p className="text-4xl font-bold">{tempoRestante.segundos || 0}</p><p className="text-sm">segundos</p></div>
          </div>
        </div>
      </header>
       <nav className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-center gap-8 py-4">
          <a href="#cerimonia" className={`text-gray-600 hover:text-pink-600 font-semibold tracking-wider`}>A CERIMÔNIA</a>
          <a href="#rsvp" className={`text-gray-600 hover:text-pink-600 font-semibold tracking-wider`}>CONFIRMAR PRESENÇA</a>
          <a href="#presentes" className={`text-gray-600 hover:text-pink-600 font-semibold tracking-wider`}>LISTA DE PRESENTES</a>
        </div>
      </nav>
      <main className="container mx-auto py-16 px-6 space-y-16">
        <section id="cerimonia" className="text-center">
            <p className="text-xl italic text-gray-600 max-w-3xl mx-auto leading-relaxed">"{dadosCasamento.mensagemCasal || 'Aguardamos vocês para celebrar este dia tão especial em nossas vidas.'}"</p><div className="mt-12 p-8 bg-white rounded-xl shadow-lg inline-block"><h3 className={`text-2xl font-playfair font-bold ${colors.text}`}>Detalhes da Cerimônia</h3><p className="text-lg mt-2">{dadosCasamento.horarioCerimonia ? `Às ${dadosCasamento.horarioCerimonia}` : 'Horário a definir'}</p><p className="text-lg mt-1">{dadosCasamento.localCerimonia || 'Local a definir'}</p></div>
        </section>
        
        <section id="rsvp">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center mx-auto">
            {etapaRsvp === 'buscar' && (<><h2 className={`text-3xl font-playfair font-bold mb-4 ${colors.text}`}>Confirme sua Presença</h2><p className="text-gray-600 mb-6">Por favor, digite o código de acesso que você recebeu no convite.</p><form onSubmit={handleFindFamily}><input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-center font-mono uppercase tracking-widest" placeholder="SEU CÓDIGO AQUI" />{errorRsvp && <p className="text-red-500 mt-2">{errorRsvp}</p>}<button type="submit" disabled={loadingRsvp} className={`w-full mt-4 text-white font-bold py-3 rounded-lg ${colors.bg} ${colors.hoverBg} disabled:bg-pink-300`}>{loadingRsvp ? 'Buscando...' : 'Encontrar Convite'}</button></form></>)}
            {etapaRsvp === 'confirmar' && familia && (<ConfirmacaoModal familia={familia} onClose={() => setEtapaRsvp('buscar')} onSave={() => setEtapaRsvp('agradecimento')} colors={colors} />)}
            {etapaRsvp === 'agradecimento' && (<div className="font-poppins"><h2 className="text-3xl font-playfair font-bold mb-4 text-green-600">Obrigado por confirmar!</h2><p className="text-gray-600 mb-8 text-lg">Sua presença é o nosso maior presente! Mas, se desejar nos presentear, ficaremos muito felizes. Preparamos algumas opções com carinho.</p><div className="border-t pt-8"><h3 className="text-2xl font-playfair mb-2">Lista de Presentes</h3><p className="text-gray-500 mb-6">Acesse nossa lista de presentes virtual.</p><a href="#presentes" className={`inline-block text-white font-bold py-3 px-8 rounded-lg ${colors.bg} ${colors.hoverBg}`}>Acessar Lista</a></div></div>)}
          </div>
        </section>

        <section id="presentes">
            <h2 className={`text-4xl font-playfair font-bold text-center mb-12 ${colors.text}`}>Lista de Presentes</h2><div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">{dadosCasamento.listaDePresentes && dadosCasamento.listaDePresentes.map(presente => (<div key={presente.id} className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col"><div className={`${colors.text} mb-4`}><svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 11h14M5 19v-2a7 7 0 017-7v0a7 7 0 017 7v2H5z"></path></svg></div><h3 className="text-xl font-semibold mb-2 flex-grow">{presente.nome}</h3><p className="text-lg text-gray-600 mb-4">R$ {presente.valor.toFixed(2).replace('.', ',')}</p><button onClick={() => setIsPixModalOpen(true)} disabled={!dadosCasamento.chavePix} className={`w-full text-white font-bold py-2 rounded-lg ${colors.bg} ${colors.hoverBg} disabled:bg-gray-300 disabled:cursor-not-allowed`}>Presentear</button></div>))}{(!dadosCasamento.listaDePresentes || dadosCasamento.listaDePresentes.length === 0) && (<p className="col-span-full text-center text-gray-500">A lista de presentes ainda não foi criada pelo casal.</p>)}</div>
        </section>
      </main>

      {isPixModalOpen && dadosCasamento.chavePix && (
        <PixModal 
          chavePix={dadosCasamento.chavePix} 
          onClose={() => setIsPixModalOpen(false)} 
          colors={colors}
        />
      )}
    </div>
  );
}

export default SiteCasamento;