import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function InformacoesGerais() {
  const [user] = useAuthState(auth);

  const [nomeNoivo, setNomeNoivo] = useState('');
  const [nomeNoiva, setNomeNoiva] = useState('');
  const [dataCasamento, setDataCasamento] = useState('');
  const [horarioCerimonia, setHorarioCerimonia] = useState('');
  const [localCerimonia, setLocalCerimonia] = useState('');
  const [mensagemCasal, setMensagemCasal] = useState('');
  const [themeColor, setThemeColor] = useState('theme-rose');
  const [imageUrl, setImageUrl] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

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
          setThemeColor(data.themeColor || 'theme-rose');
          setImageUrl(data.imageUrl || '');
          setChavePix(data.chavePix || '');
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
      await setDoc(userDocRef, { nomeNoivo, nomeNoiva, dataCasamento, horarioCerimonia, localCerimonia, mensagemCasal, themeColor, chavePix }, { merge: true });
      setMensagem('Informações salvas com sucesso!');
    } catch (error) {
      setMensagem('Erro ao salvar as informações.');
    }
  };
  
  const handleImageUpload = () => {
    if (!imageFile || !user) return;
    const storageRef = ref(storage, `fotos/${user.uid}/headerImage`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Erro no upload: ", error);
        alert("Erro ao enviar a imagem.");
        setUploadProgress(0);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageUrl(downloadURL);
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { imageUrl: downloadURL });
          setUploadProgress(0);
          setImageFile(null);
          alert("Imagem enviada com sucesso!");
        });
      }
    );
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/casamento/${user.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess('Link copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-playfair font-bold mb-6 text-pink-800">Informações e Tema</h2>
        <form onSubmit={handleSaveInfo} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="nomeNoivo" className="block text-gray-700 font-semibold mb-2">Nome do Noivo</label><input type="text" id="nomeNoivo" value={nomeNoivo} onChange={(e) => setNomeNoivo(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label htmlFor="nomeNoiva" className="block text-gray-700 font-semibold mb-2">Nome da Noiva</label><input type="text" id="nomeNoiva" value={nomeNoiva} onChange={(e) => setNomeNoiva(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
          <div><label htmlFor="mensagemCasal" className="block text-gray-700 font-semibold mb-2">Mensagem de Boas-vindas</label><textarea id="mensagemCasal" value={mensagemCasal} onChange={(e) => setMensagemCasal(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="3" placeholder="Escreva uma mensagem carinhosa..."></textarea></div>
          <div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="dataCasamento" className="block text-gray-700 font-semibold mb-2">Data do Casamento</label><input type="date" id="dataCasamento" value={dataCasamento} onChange={(e) => setDataCasamento(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label htmlFor="horarioCerimonia" className="block text-gray-700 font-semibold mb-2">Horário da Cerimônia</label><input type="time" id="horarioCerimonia" value={horarioCerimonia} onChange={(e) => setHorarioCerimonia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
          <div><label htmlFor="localCerimonia" className="block text-gray-700 font-semibold mb-2">Local da Cerimônia e Festa</label><input type="text" id="localCerimonia" value={localCerimonia} onChange={(e) => setLocalCerimonia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Sítio Meio do Mato, Rio de Janeiro" /></div>
          <div><label htmlFor="chavePix" className="block text-gray-700 font-semibold mb-2">Chave PIX para Presentes</label><input type="text" id="chavePix" value={chavePix} onChange={(e) => setChavePix(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: email@dominio.com, CPF ou telefone" /></div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tema de Cores</label>
            <div className="flex gap-4"><button type="button" onClick={() => setThemeColor('theme-rose')} className={`w-10 h-10 rounded-full bg-rose-500 ${themeColor === 'theme-rose' && 'ring-2 ring-offset-2 ring-rose-500'}`}></button><button type="button" onClick={() => setThemeColor('theme-sky')} className={`w-10 h-10 rounded-full bg-sky-500 ${themeColor === 'theme-sky' && 'ring-2 ring-offset-2 ring-sky-500'}`}></button><button type="button" onClick={() => setThemeColor('theme-emerald')} className={`w-10 h-10 rounded-full bg-emerald-500 ${themeColor === 'theme-emerald' && 'ring-2 ring-offset-2 ring-emerald-500'}`}></button><button type="button" onClick={() => setThemeColor('theme-amber')} className={`w-10 h-10 rounded-full bg-amber-500 ${themeColor === 'theme-amber' && 'ring-2 ring-offset-2 ring-amber-500'}`}></button></div>
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">Salvar Informações e Tema</button>
          {mensagem && <p className="text-center mt-4 text-green-600">{mensagem}</p>}
        </form>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md"><h2 className="text-2xl font-playfair font-bold mb-4 text-pink-800">Foto Principal do Site</h2>{imageUrl && <img src={imageUrl} alt="Foto do casal" className="w-full h-48 object-cover rounded-lg mb-4" />}<label htmlFor="upload-foto" className="block text-gray-700 font-semibold mb-2">Escolher nova foto:</label><input id="upload-foto" type="file" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>{uploadProgress > 0 && <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4"><div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>}<button onClick={handleImageUpload} disabled={!imageFile || uploadProgress > 0} className="mt-4 w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300">{uploadProgress > 0 ? `Enviando... ${Math.round(uploadProgress)}%` : 'Enviar Imagem'}</button></div>
      <div className="bg-white p-8 rounded-lg shadow-md"><h2 className="text-2xl font-playfair font-bold mb-4 text-pink-800">Link do seu Site</h2><p className="text-gray-600 mb-4">Compartilhe este link com seus convidados.</p><div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg"><input type="text" readOnly value={`${window.location.origin}/casamento/${user?.uid}`} className="w-full bg-transparent outline-none text-gray-700" /><button onClick={copyToClipboard} className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 flex-shrink-0">Copiar Link</button></div>{copySuccess && <p className="text-center mt-3 text-green-600 text-sm">{copySuccess}</p>}</div>
    </div>
  );
}

export default InformacoesGerais;