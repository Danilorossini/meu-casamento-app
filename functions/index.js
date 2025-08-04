// Importa as ferramentas necessárias do Firebase Functions e do Firebase Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializa nosso app no ambiente do servidor (back-end) para que a função tenha acesso ao projeto
admin.initializeApp();

/**
 * Esta é a nossa Cloud Function.
 * O nome dela é "criarPerfilDeUsuario".
 * Ela é acionada (triggered) toda vez que um novo usuário
 * é criado no Firebase Authentication.
 */
exports.criarPerfilDeUsuario = functions.auth.user().onCreate((user) => {
  // A variável 'user' contém os dados do usuário que acabou de se cadastrar (uid, email, etc.)
  console.log("Um novo usuário se cadastrou:", user.uid, user.email);

  // Aqui, preparamos os dados que queremos salvar no Firestore
  const novoPerfil = {
    email: user.email, // Salva o email do usuário
    dataDeCriacao: admin.firestore.FieldValue.serverTimestamp(), // Salva a data e hora exata do cadastro
    plano: "gratuito", // Define o plano padrão de todo novo usuário como "gratuito"
  };

  // Aqui, a mágica acontece:
  // 1. Acessamos o Firestore (admin.firestore())
  // 2. Dizemos que queremos a coleção "users" (collection("users"))
  // 3. Criamos um novo documento com o ID do usuário (doc(user.uid))
  // 4. Salvamos os dados do novoPerfil dentro desse documento (.set(novoPerfil))
  return admin.firestore().collection("users").doc(user.uid).set(novoPerfil);
});