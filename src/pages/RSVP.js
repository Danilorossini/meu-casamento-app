import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import EditConvidadoModal from '../components/EditConvidadoModal';
import ConfirmacaoModal from '../components/ConfirmacaoModal';
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const auth = getAuth(app);
const db = getFirestore(app);

function RSVP() {
  const [user] = useAuthState(auth);
  const [convidados, setConvidados] = useState([]);
  const [nomeFamilia, setNomeFamilia] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [integrantesAdultos, setIntegrantesAdultos] = useState('');
  const [integrantesCriancas, setIntegrantesCriancas] = useState('');
  const [totalConvidados, setTotalConvidados] = useState(0);
  const [totalAdultos, setTotalAdultos] = useState(0);
  const [totalCriancas, setTotalCriancas] = useState(0);
  const [totalConfirmados, setTotalConfirmados] = useState(0);
  const [familiaParaEditar, setFamiliaParaEditar] = useState(null);
  const [familiaParaConfirmar, setFamiliaParaConfirmar] = useState(null);

  const fetchConvidados = async (uid) => {
    const convidadosColRef = collection(db, 'users', uid, 'convidados');
    const q = query(convidadosColRef, orderBy('nomeFamilia', 'asc'));
    const querySnapshot = await getDocs(q);
    let contAdultos = 0, contCriancas = 0, contConfirmados = 0;
    const convidadosList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      if(data.integrantes) {
        data.integrantes.forEach(integrante => {
          if (integrante.tipo === 'adulto') contAdultos++;
          if (integrante.tipo === 'crianca') contCriancas++;
          if (integrante.status === 'Confirmado') contConfirmados++;
        });
      }
      return { id: doc.id, userId: uid, ...data };
    });
    setConvidados(convidadosList);
    setTotalAdultos(contAdultos); setTotalCriancas(contCriancas);
    setTotalConvidados(contAdultos + contCriancas); setTotalConfirmados(contConfirmados);
  };
  useEffect(() => { if (user) { fetchConvidados(user.uid); } }, [user]);
  const handleAddFamilia = async (e) => {
    e.preventDefault();
    if (!nomeFamilia || !codigoAcesso) return alert('Preencha o nome da família e o código de acesso.');
    const adultos = integrantesAdultos.split('\n').filter(n => n.trim() !== '').map(n => ({ nome: n.trim(), tipo: 'adulto', status: 'Pendente' }));
    const criancas = integrantesCriancas.split('\n').filter(n => n.trim() !== '').map(n => ({ nome: n.trim(), tipo: 'crianca', status: 'Pendente' }));
    const novaFamilia = { nomeFamilia, codigo: codigoAcesso.toUpperCase(), integrantes: [...adultos, ...criancas] };
    const convidadosColRef = collection(db, 'users', user.uid, 'convidados');
    await addDoc(convidadosColRef, novaFamilia);
    setNomeFamilia(''); setCodigoAcesso(''); setIntegrantesAdultos(''); setIntegrantesCriancas('');
    fetchConvidados(user.uid);
  };
  const handleDeleteConvidado = async (idConvidado) => {
    if (window.confirm('Tem certeza que deseja excluir esta família?')) {
      const docRef = doc(db, 'users', user.uid, 'convidados', idConvidado);
      await deleteDoc(docRef);
      fetchConvidados(user.uid);
    }
  };
  const getExcelData = () => {
    const data = [];
    convidados.forEach(familia => {
      familia.integrantes.forEach(integrante => {
        data.push({ Familia: familia.nomeFamilia, Integrante: integrante.nome, Tipo: integrante.tipo, Status: integrante.status, Codigo: familia.codigo });
      });
    });
    return data;
  };

  // --- FUNÇÃO DE PDF ATUALIZADA ---
  const handlePdfConfirmados = () => {
    const confirmados = [];
    convidados.forEach(familia => {
      familia.integrantes.forEach(integrante => {
        if (integrante.status === 'Confirmado') {
          // 1. Agora salvamos o nome E o tipo
          confirmados.push({ 
            nome: integrante.nome,
            tipo: integrante.tipo.charAt(0).toUpperCase() + integrante.tipo.slice(1) // Deixa a primeira letra maiúscula (ex: "Adulto")
          });
        }
      });
    });
    
    const sortedConfirmados = confirmados.sort((a, b) => a.nome.localeCompare(b.nome));

    const doc = new jsPDF();
    doc.text("Lista de Convidados Confirmados", 14, 15);

    autoTable(doc, {
      startY: 20,
      // 2. Adicionamos a nova coluna no cabeçalho
      head: [['Nome Completo do Convidado', 'Tipo']],
      // 3. Adicionamos o novo dado no corpo da tabela
      body: sortedConfirmados.map(c => [c.nome, c.tipo]),
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60] }
    });
    
    doc.save('convidados-confirmados.pdf');
  };

  return (
    <div className="space-y-8">
      {/* ... (todo o resto do JSX continua exatamente o mesmo) ... */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold">{totalConvidados}</p><p className="text-sm text-gray-500">Convidados Totais</p></div><div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold">{totalAdultos}</p><p className="text-sm text-gray-500">Adultos</p></div><div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold">{totalCriancas}</p><p className="text-sm text-gray-500">Crianças</p></div><div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold text-green-600">{totalConfirmados}</p><p className="text-sm text-gray-500">Confirmados</p></div></div>
      <div className="bg-white p-8 rounded-lg shadow-md"><h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Adicionar Família / Convidados</h2><form onSubmit={handleAddFamilia} className="space-y-4"><div className="flex gap-4"><div className="w-2/3"><label htmlFor="nomeFamilia" className="block text-gray-700 font-semibold mb-2">Nome da Família</label><input type="text" id="nomeFamilia" value={nomeFamilia} onChange={(e) => setNomeFamilia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Família Silva" /></div><div className="w-1/3"><label htmlFor="codigoAcesso" className="block text-gray-700 font-semibold mb-2">Código de Acesso</label><input type="text" id="codigoAcesso" value={codigoAcesso} onChange={(e) => setCodigoAcesso(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: SILVA123" /></div></div><div className="flex gap-4"><div className="w-1/2"><label htmlFor="integrantesAdultos" className="block text-gray-700 font-semibold mb-2">Integrantes Adultos (um por linha)</label><textarea id="integrantesAdultos" value={integrantesAdultos} onChange={(e) => setIntegrantesAdultos(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="4"></textarea></div><div className="w-1/2"><label htmlFor="integrantesCriancas" className="block text-gray-700 font-semibold mb-2">Integrantes Crianças (um por linha)</label><textarea id="integrantesCriancas" value={integrantesCriancas} onChange={(e) => setIntegrantesCriancas(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="4"></textarea></div></div><button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600">Adicionar Família</button></form></div>
      <div className="bg-white p-8 rounded-lg shadow-md"><h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Lista de Convidados</h2><div className="overflow-x-auto">{convidados.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhuma família adicionada ainda.</p> : (<table className="min-w-full bg-white"><thead className="bg-gray-50"><tr><th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Família / Integrantes</th><th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th><th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead><tbody className="divide-y divide-gray-200">{convidados.map((familia) => (<tr key={familia.id}><td className="py-4 px-6 align-top"><p className="font-bold text-lg">{familia.nomeFamilia}</p><ul className="mt-2 space-y-2">{familia.integrantes && familia.integrantes.map((integrante, index) => (<li key={index} className="flex items-center gap-2 text-sm text-gray-600"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${integrante.status === 'Confirmado' ? 'bg-green-100 text-green-800' : integrante.status === 'Recusado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{integrante.status}</span><span>{integrante.nome} {integrante.tipo && `(${integrante.tipo})`}</span></li>))}</ul></td><td className="py-4 px-6 align-top font-mono text-center">{familia.codigo}</td><td className="py-4 px-6 text-right align-top"><div className="flex justify-end items-start gap-2"><button onClick={() => setFamiliaParaConfirmar(familia)} className="text-green-600 hover:text-green-800" title="Confirmar Presença (Admin)"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button><button onClick={() => setFamiliaParaEditar(familia)} className="text-blue-600 hover:text-blue-900" title="Editar Família"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg></button><button onClick={() => handleDeleteConvidado(familia.id)} className="text-red-600 hover:text-red-900" title="Excluir Família"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg></button></div></td></tr>))}</tbody></table>)}</div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Relatórios e Exportação</h2>
        <div className="flex flex-wrap gap-4">
          <CSVLink data={getExcelData()} filename={"lista-convidados-completa.csv"} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">Exportar Lista Completa (Excel)</CSVLink>
          <button onClick={handlePdfConfirmados} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Gerar PDF de Confirmados</button>
          <button onClick={() => alert('Aguardando o layout para implementar!')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300" disabled>Gerar PDF por Família</button>
        </div>
      </div>
      {familiaParaEditar && (<EditConvidadoModal familia={familiaParaEditar} onClose={() => setFamiliaParaEditar(null)} onSave={() => { setFamiliaParaEditar(null); fetchConvidados(user.uid); }}/>)}
      {familiaParaConfirmar && (<ConfirmacaoModal familia={familiaParaConfirmar} onClose={() => setFamiliaParaConfirmar(null)} onSave={() => { setFamiliaParaConfirmar(null); fetchConvidados(user.uid); }}/>)}
    </div>
  );
}

export default RSVP;