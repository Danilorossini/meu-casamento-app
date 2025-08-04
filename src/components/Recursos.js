import React from 'react';

function Recursos() {
  return (
    <section id="recursos" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-playfair font-bold text-center mb-12">
          Recursos Incríveis para o seu Grande Dia
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Recurso 1: RSVP Inteligente */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-pink-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">RSVP Inteligente</h3>
            <p className="text-gray-600">
              Confirmação de presença com senha por família. Saiba exatamente
              quem vai, incluindo adultos e crianças.
            </p>
          </div>
          {/* Recurso 2: Lista de Presentes */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-pink-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Lista de Presentes em Dinheiro
            </h3>
            <p className="text-gray-600">
              Crie uma lista com presentes simbólicos e receba o valor total em
              dinheiro, de forma prática e segura.
            </p>
          </div>
          {/* Recurso 3: Painel Completo */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-pink-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Painel de Controle Completo
            </h3>
            <p className="text-gray-600">
              Gerencie tudo em um só lugar. Exporte suas listas para PDF ou
              Excel e tenha o controle total do seu evento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recursos;