import Header from './components/Header';
import Hero from './components/Hero';
import Recursos from './components/Recursos';
import Planos from './components/Planos';
import Contato from './components/Contato'; // 1. Importamos o Contato
import Footer from './components/Footer';   // 2. Importamos o Footer

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Recursos />
      <Planos />
      <Contato /> {/* 3. Usamos o Contato */}
      <Footer />  {/* 4. E finalizamos com o Footer */}
    </div>
  );
}

export default App;