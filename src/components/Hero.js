import React from 'react';

function Hero() {
  return (
    <section className="text-center py-20 px-6 bg-white">
      <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4">
        O site do seu casamento, <br />
        simples e elegante.
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Gerencie seus convidados, crie sua lista de presentes em dinheiro e
        compartilhe os melhores momentos. Tudo em um só lugar.
      </p>
      <a
        href="#planos"
        className="bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-pink-700 transition-transform transform hover:scale-105"
      >
        Ver Planos
      </a>
    </section>
  );
}

export default Hero;