import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

// Este componente recebe a família, uma função para fechar, e uma função para quando a confirmação for salva
function ConfirmacaoModal({ familia, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para os checkboxes e nomes completos
  const [confirmacoes, setConfirmacoes] = useState(() => {
    const initialState = {};
    familia.integrantes.forEach((p, index) => {
      initialState[index] = p.status === 'Confirmado';
    });
    return initialState;
  });
  
  const [nomesCompletos, setNomesCompletos] = useState(() => {
    const initialState = {};
    familia.integrantes.forEach((p, index) => {
      initialState[index] = p.status === 'Confirmado' ? p.nome : '';
    });
    return initialState;
  });

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

    const docRef = doc(db, 'users', familia.userId, 'convidados', familia.id);

    try {
      await updateDoc(docRef, { integrantes: integrantesAtualizados });
      onSave(); // Avisa o componente pai para atualizar a lista
      onClose(); // Fecha o modal
    } catch (err) {
      console.error("Erro ao confirmar presença:", err);
      setError('Ocorreu um erro ao salvar sua resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-3xl font-playfair font-bold mb-2 text-pink-800">Confirmar Presença</h2>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{familia.nomeFamilia}</h3>
        <p className="text-gray-600 mb-6">Marque quem comparecerá e preencha o nome completo.</p>
        <form onSubmit={handleSubmitRsvp}>
          <div className="space-y-4 text-left border-t border-b py-4 max-h-64 overflow-y-auto">
            {familia.integrantes.map((integrante, index) => (
              <div key={index} className="p-3 rounded-lg hover:bg-pink-50">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={confirmacoes[index] || false} onChange={() => handleConfirmacaoChange(index)} className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                  <span className="ml-4 text-lg text-gray-700">{integrante.nome}</span>
                </label>
                {confirmacoes[index] && (
                  <div className="mt-2 ml-10">
                    <label className="text-sm text-gray-500">Nome completo para a lista</label>
                    <input type="text" value={nomesCompletos[index] || ''} onChange={(e) => handleNomeCompletoChange(index, e.target.value)} className="w-full px-3 py-1 mt-1 border rounded-md text-sm" placeholder="Digite o nome completo aqui" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 disabled:bg-green-300">
              {loading ? 'Confirmando...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmacaoModal;