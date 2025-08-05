import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  // 1. Criamos um estado para controlar se o menu mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Adicionamos 'relative' para que o menu suspenso se posicione corretamente
    <header className="bg-white shadow-md sticky top-0 z-50 relative">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-600 font-playfair">
          meu casamento
        </div>

        {/* --- MENU PARA DESKTOP (Telas médias e grandes) --- */}
        {/* A classe 'hidden' esconde em telas pequenas, e 'md:flex' mostra em telas médias para cima */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#recursos" className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md">Recursos</a>
          <a href="#planos" className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md">Planos</a>
          <a href="#contato" className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md">Contato</a>
          <Link to="/login" className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
            Login
          </Link>
        </div>

        {/* --- BOTÃO HAMBÚRGUER (Apenas para Telas Pequenas) --- */}
        {/* A classe 'md:hidden' esconde este botão em telas médias para cima */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Inverte o estado do menu (abre/fecha)
            className="text-gray-600 hover:text-pink-600 focus:outline-none"
          >
            {/* Ícone de 'X' se o menu estiver aberto, ou ícone de hambúrguer se estiver fechado */}
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            )}
          </button>
        </div>
      </nav>

      {/* --- PAINEL DO MENU MOBILE (Aparece e desaparece) --- */}
      {/* Usamos uma classe condicional: se 'isMenuOpen' for true, ele mostra ('block'), senão, esconde ('hidden') */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white shadow-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
          <a href="#recursos" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium">Recursos</a>
          <a href="#planos" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium">Planos</a>
          <a href="#contato" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium">Contato</a>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="mt-2 w-3/4 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;