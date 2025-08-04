import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import app from '../firebase';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

const auth = getAuth(app);

function PainelLayout() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    signOut(auth);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho do Painel */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Seu Painel</h1>
            <p className="text-sm text-gray-600">Logado como: <strong>{user?.email}</strong></p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Menu de Navegação Lateral */}
          <aside className="w-full md:w-1/4">
            <nav className="space-y-1">
              <NavLink 
                to="/painel/info"
                className={({ isActive }) => isActive ? "bg-pink-100 text-pink-700 block rounded-md px-3 py-2 text-base font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"}
              >
                Informações Gerais
              </NavLink>
              <NavLink 
                to="/painel/presentes"
                className={({ isActive }) => isActive ? "bg-pink-100 text-pink-700 block rounded-md px-3 py-2 text-base font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"}
              >
                Lista de Presentes
              </NavLink>
              <NavLink 
                to="/painel/rsvp"
                className={({ isActive }) => isActive ? "bg-pink-100 text-pink-700 block rounded-md px-3 py-2 text-base font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"}
              >
                RSVP
              </NavLink>
              {/* Futuramente, adicione aqui os links para Convite, etc. */}
            </nav>
          </aside>

          {/* Área de Conteúdo Principal */}
          <div className="w-full md:w-3/4">
            {/* O Outlet é o espaço onde as sub-páginas (Info, Presentes, RSVP) serão renderizadas */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PainelLayout;