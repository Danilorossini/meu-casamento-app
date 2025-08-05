import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const auth = getAuth(app); // Corrigido para pegar a instância do app
const db = getFirestore(app);
const storage = getStorage(app);

function Convite() {
  const [user] = useAuthState(auth);
  // O estado 'copySuccess' agora será usado corretamente
  const [copySuccess, setCopySuccess] = useState(''); 

  const [imageSource, setImageSource] = useState('geral');
  const [generalImageUrl, setGeneralImageUrl] = useState('');
  const [inviteImageUrl, setInviteImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const fetchData = async () => {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImageSource(data.conviteImageSource || 'geral');
          setGeneralImageUrl(data.imageUrl || '');
          setInviteImageUrl(data.conviteImageUrl || '');
        }
      };
      fetchData();
    }
  }, [user]);

  const handleImageSourceChange = async (source) => {
    setImageSource(source);
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { conviteImageSource: source });
    }
  };

  const handleImageUpload = () => {
    if (!imageFile || !user) return;
    const storageRef = ref(storage, `fotos/${user.uid}/conviteImage`);
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
          setInviteImageUrl(downloadURL);
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { conviteImageUrl: downloadURL });
          setUploadProgress(0);
          setImageFile(null);
          alert("Nova imagem do convite enviada com sucesso!");
        });
      }
    );
  };

  const linkDoConvite = `${window.location.origin}/convite/${user?.uid}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkDoConvite).then(() => {
      setCopySuccess('Link copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-playfair font-bold mb-4 text-pink-800">Seu Convite Digital</h2>
        <p className="text-gray-600 mb-6">Compartilhe este link com seus convidados por WhatsApp, e-mail ou redes sociais.</p>
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
          <input type="text" readOnly value={linkDoConvite} className="w-full bg-transparent outline-none"/>
          <button onClick={copyToClipboard} className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 flex-shrink-0">Copiar Link</button>
        </div>
        {copySuccess && <p className="text-center mt-3 text-green-600 text-sm">{copySuccess}</p>}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-playfair font-bold mb-4 text-pink-800">Imagem de Fundo do Convite</h3>
        <div className="space-y-4">
          <div className="flex items-center"><input type="radio" id="fotoGeral" name="imageSource" value="geral" checked={imageSource === 'geral'} onChange={() => handleImageSourceChange('geral')} className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"/><label htmlFor="fotoGeral" className="ml-3 block text-sm font-medium text-gray-700">Usar a mesma foto principal do site</label></div>
          {imageSource === 'geral' && generalImageUrl && <img src={generalImageUrl} alt="Foto principal" className="w-full h-32 object-cover rounded-md"/>}
          <div className="flex items-center"><input type="radio" id="fotoNova" name="imageSource" value="nova" checked={imageSource === 'nova'} onChange={() => handleImageSourceChange('nova')} className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"/><label htmlFor="fotoNova" className="ml-3 block text-sm font-medium text-gray-700">Enviar uma foto diferente para o convite</label></div>
          {imageSource === 'nova' && (<div className="pl-6 pt-4 border-l-2 border-pink-100">{inviteImageUrl && <img src={inviteImageUrl} alt="Foto do convite" className="w-full h-32 object-cover rounded-md mb-4"/>}<input id="upload-convite" type="file" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>{uploadProgress > 0 && <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4"><div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>}<button onClick={handleImageUpload} disabled={!imageFile || uploadProgress > 0} className="mt-4 w-auto bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300">{uploadProgress > 0 ? `Enviando...` : 'Enviar Nova Imagem'}</button></div>)}
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-playfair font-bold mb-4 text-pink-800">Pré-visualização</h3>
        <div className="w-full h-96 border rounded-lg overflow-hidden">
          <iframe src={linkDoConvite} title="Pré-visualização do Convite" className="w-full h-full" key={Date.now()} />
        </div>
      </div>
    </div>
  );
}

export default Convite;