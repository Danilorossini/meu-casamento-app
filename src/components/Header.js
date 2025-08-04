// Importa o React para que possamos usar JSX (o HTML do React)
import React from 'react';

// Define o nosso componente Header como uma função
function Header() {
  // O componente retorna o código JSX que será exibido na tela
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-600 font-playfair">
          meu casamento
        </div>
        <div>
          <a href="#recursos" className="text-gray-600 hover:text-pink-600 px-4">
            Recursos
          </a>
          <a href="#planos" className="text-gray-600 hover:text-pink-600 px-4">
            Planos
          </a>
          <a href="#contato" className="text-gray-600 hover:text-pink-600 px-4">
            Contato
          </a>
          <a href="login.html" className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
            Login
          </a>
        </div>
      </nav>
    </header>
  );
}

// Exporta o componente para que possamos usá-lo em outros lugares do nosso site
export default Header;