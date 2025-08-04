import React from 'react';

function Contato() {
  return (
    <section id="contato" className="py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-playfair font-bold text-center mb-4">
          Ficou com alguma dúvida?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Envie uma mensagem para nós! Será um prazer ajudar a tornar seu grande
          dia ainda mais especial.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <a
            href="mailto:contato@meucasamento.com.br"
            className="inline-flex items-center justify-center bg-white shadow-md rounded-lg px-6 py-3 text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <span>contato@meucasamento.com.br</span>
          </a>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white shadow-md rounded-lg px-6 py-3 text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors"
          >
            {/* ESTE FOI O SVG QUE MUDOU PARA O LOGO OFICIAL */}
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.74.45 3.39 1.28 4.85L2.05 22l5.3-1.36c1.41.76 3 1.17 4.69 1.17h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zM9.53 7.89c.2-.24.44-.38.71-.38.27 0 .51.01.71.01.27.01.62-.09.89.55.27.64.9 2.16.98 2.31.08.15.14.33.05.52-.09.19-.23.3-.42.47-.19.17-.4.34-.58.42-.25.11-.5.23-.72.41-.22.18-.46.41-.65.65-.19.24-.38.51-.19.89.19.38.83 1.29 1.78 2.19.95.9 1.83 1.25 2.11 1.41.28.16.44.13.6-.05.16-.18.7-.82.89-1.1.19-.28.38-.23.65-.14.27.09 1.75.82 2.05.97.3.15.5.23.58.33.08.1.04.64-.15 1.24-.19.6-.44.97-1.02 1.24-.58.27-1.29.42-1.88.33-.59-.09-1.39-.28-2.6-.87-1.21-.59-2.28-1.39-3.12-2.39-.84-1-1.52-2.21-1.74-3.48-.22-1.27-.02-2.31.42-3.13z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contato;