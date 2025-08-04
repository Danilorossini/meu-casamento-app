import React from 'react';

function Planos() {
  return (
    <section id="planos" className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-playfair font-bold text-center mb-12">
          Escolha o Plano Perfeito para Vocês
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Plano Gratuito */}
          <div className="border p-8 rounded-xl shadow-lg text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Gratuito</h3>
            <p className="text-4xl font-bold mb-2">
              R$ 0<span className="text-lg font-normal">,00</span>
            </p>
            <p className="text-gray-500 mb-6">Teste por 3 dias</p>
            <ul className="text-left space-y-3 text-gray-700 flex-grow">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Sistema de RSVP com Senha
              </li>
            </ul>
            <a href="login.html" className="mt-8 block bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700">
              Começar Teste
            </a>
          </div>

          {/* Plano Completo (Destaque) */}
          <div className="bg-pink-50 border-2 border-pink-500 p-8 rounded-xl shadow-2xl text-center flex flex-col transform md:scale-105 relative">
            <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2">
              MAIS POPULAR
            </span>
            <h3 className="text-3xl font-bold text-pink-900 mb-4">Completo</h3>
            <p className="text-5xl font-bold mb-2">
              R$ 99<span className="text-lg font-normal">,90</span>
            </p>
            <p className="text-gray-600 mb-6">Pagamento único</p>
            <ul className="text-left space-y-3 text-gray-700 flex-grow">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Convite Digital Interativo
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Sistema de RSVP com Senha
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Lista de Presentes em Dinheiro
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Painel de Controle Completo
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Exportação para PDF e Excel
              </li>
            </ul>
            <a href="login.html" className="mt-8 block bg-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700 transition-transform transform hover:scale-105">
              Quero Este Plano
            </a>
          </div>

          {/* Plano Básico */}
          <div className="border p-8 rounded-xl shadow-lg text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Básico</h3>
            <p className="text-4xl font-bold mb-2">
              R$ 49<span className="text-lg font-normal">,90</span>
            </p>
            <p className="text-gray-500 mb-6">Pagamento único</p>
            <ul className="text-left space-y-3 text-gray-700 flex-grow">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Convite Digital (não interativo)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Sistema de RSVP com Senha
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Painel de Controle (só RSVP)
              </li>
            </ul>
            <a href="login.html" className="mt-8 block bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700">
              Assinar Básico
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Planos;