// Importa a função para inicializar o Firebase
import { initializeApp } from "firebase/app";

// Objeto de configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQF3BkCw41AaY6btxk8cVgXO0rjvXil2s",
  authDomain: "meu-casamento-504d9.firebaseapp.com",
  projectId: "meu-casamento-504d9",
  storageBucket: "meu-casamento-504d9.firebasestorage.app",
  messagingSenderId: "710476267365",
  appId: "1:710476267365:web:0e92df0f736a37ae0cab8c"
};

// Inicializa o Firebase com as suas configurações
const app = initializeApp(firebaseConfig);

// Exporta a instância do app para ser usada em outras partes do projeto
export default app;