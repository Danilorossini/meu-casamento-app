import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Recursos from '../components/Recursos';
import Planos from '../components/Planos';
import Contato from '../components/Contato';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Recursos />
      <Planos />
      <Contato />
      <Footer />
    </div>
  );
}

export default Home;