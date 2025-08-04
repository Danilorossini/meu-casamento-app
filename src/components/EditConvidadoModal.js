import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

function EditConvidadoModal({ familia, onClose, onSave }) {
  
  const [nomeFamilia, setNomeFamilia] = useState(familia.nomeFamilia);
  const [codigoAcesso, setCodigoAcesso] = useState(familia.codigo);
  
  const [integrantesAdultos, setIntegrantesAdultos] = useState(
    familia.integrantes.filter(p => p.tipo === 'adulto').map(p => p.nome).join('\n')
  );
  const [integrantesCriancas, setIntegrantesCriancas] = useState(
    familia.integrantes.filter(p => p.tipo === 'crianca').map(p => p.nome).join('\n')
  );

  // --- FUNÇÃO DE SALVAR SIMPLIFICADA E CORRIGIDA ---
  const handleSave = async (e) => {
    e.preventDefault();

    // Recria a lista de adultos a partir do textarea, garantindo que o tipo e status sejam definidos corretamente.
    const adultos = integrantesAdultos.split('\n').filter(nome => nome.trim() !== '').map(nome => ({
      nome: nome.trim(),
      tipo: 'adulto',
      status: 'Pendente' // Simplificação: O status é resetado para 'Pendente' ao editar.
    }));

    // Recria a lista de crianças, garantindo o tipo e status.
    const criancas = integrantesCriancas.split('\n').filter(nome => nome.trim() !== '').map(nome => ({
      nome: nome.trim(),
      tipo: 'crianca',
      status: 'Pendente' // Simplificação: O status é resetado para 'Pendente' ao editar.
    }));
    
    const dadosAtualizados = {
      nomeFamilia,
      codigo: codigoAcesso.toUpperCase(),
      integrantes: [...adultos, ...criancas], // Junta as duas listas
    };

    // Atualiza o documento no Firestore
    const docRef = doc(db, 'users', familia.userId, 'convidados', familia.id);
    await updateDoc(docRef, dadosAtualizados);

    onSave(); // Avisa o componente pai para atualizar a lista
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Editar Família / Convidados</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-2/3"><label htmlFor="editNomeFamilia" className="block text-gray-700 font-semibold mb-2">Nome da Família</label><input type="text" id="editNomeFamilia" value={nomeFamilia} onChange={(e) => setNomeFamilia(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
            <div className="w-1/3"><label htmlFor="editCodigoAcesso" className="block text-gray-700 font-semibold mb-2">Código de Acesso</label><input type="text" id="editCodigoAcesso" value={codigoAcesso} onChange={(e) => setCodigoAcesso(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2"><label htmlFor="editIntegrantesAdultos" className="block text-gray-700 font-semibold mb-2">Integrantes Adultos (um por linha)</label><textarea id="editIntegrantesAdultos" value={integrantesAdultos} onChange={(e) => setIntegrantesAdultos(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="4"></textarea></div>
            <div className="w-1/2"><label htmlFor="editIntegrantesCriancas" className="block text-gray-700 font-semibold mb-2">Integrantes Crianças (um por linha)</label><textarea id="editIntegrantesCriancas" value={integrantesCriancas} onChange={(e) => setIntegrantesCriancas(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="4"></textarea></div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditConvidadoModal;