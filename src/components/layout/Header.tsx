import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, SearchIcon, UserIcon, MenuIcon, XIcon } from '../ui/Icons';
import { useStore } from '../../store/useStore';
import { signOut } from '../../lib/auth';
import sigoLogo from '../../assets/sigo-logo.png';

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Repuestos', to: '/catalog' },
  { label: 'Categorías', to: '/categories' },
  { label: 'Ofertas', to: '/catalog?filter=sale' },
  { label: 'Nosotros', to: '/about' },
  { label: 'Contacto', to: '/contact' },
];

export function Header() {
  const { cartCount, isLoggedIn, isAdmin, user, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-sigo-black/95 backdrop-blur-md border-b border-sigo-border">
      {/* Top bar */}
      <div className="bg-sigo-orange text-white text-xs font-medium text-center py-1.5 hidden md:block">
        Envío gratis en compras mayores a Q200 · Atención por WhatsApp
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={sigoLogo} alt="SIGO Autorepuestos" className="h-11 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sigo-light hover:text-white px-3 py-2 text-sm font-medium rounded hover:bg-sigo-surface transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Buscar repuesto, marca o código..."
                className="bg-sigo-surface border border-sigo-border text-white placeholder-sigo-muted text-sm px-3 py-1.5 rounded w-48 focus:outline-none focus:border-sigo-orange"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-sigo-muted hover:text-white">
                <XIcon size={16} />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-sigo-light hover:text-sigo-orange p-2 rounded hover:bg-sigo-surface transition-colors">
              <SearchIcon size={20} />
            </button>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 text-sigo-light hover:text-white p-2 rounded hover:bg-sigo-surface transition-colors"
          >
            <UserIcon size={20} />
            {isLoggedIn && <span className="hidden md:inline text-xs text-sigo-light">{user?.name}</span>}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-sigo-dark border border-sigo-border rounded-lg shadow-2xl py-1 w-44 menu-fade z-50">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <>
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-sigo-orange font-semibold hover:bg-sigo-surface">Panel de administrador</Link>
                      <hr className="border-sigo-border my-1" />
                    </>
                  )}
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-sigo-light hover:text-white hover:bg-sigo-surface">Mi cuenta</Link>
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-sigo-light hover:text-white hover:bg-sigo-surface">Mis pedidos</Link>
                  <hr className="border-sigo-border my-1" />
                  <button onClick={async () => { await signOut().catch(() => {}); logout(); setUserMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-sigo-surface">Cerrar sesión</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-sigo-light hover:text-white hover:bg-sigo-surface">Iniciar sesión</Link>
                  <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-sigo-orange hover:bg-sigo-surface font-semibold">Crear cuenta</Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative text-sigo-light hover:text-sigo-orange p-2 rounded hover:bg-sigo-surface transition-colors">
          <ShoppingCartIcon size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-sigo-orange text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-sigo-light hover:text-white p-2">
          {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-sigo-dark border-t border-sigo-border menu-fade">
          <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-3 border-b border-sigo-border">
            <SearchIcon size={16} className="text-sigo-muted flex-shrink-0" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Buscar repuestos..."
              className="bg-transparent text-white placeholder-sigo-muted text-sm flex-1 focus:outline-none"
            />
            <button type="submit" className="text-sigo-orange text-xs font-bold">BUSCAR</button>
          </form>
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sigo-light hover:text-white hover:bg-sigo-surface border-b border-sigo-border/50 font-medium"
            >
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="flex gap-3 px-4 py-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center border border-sigo-border text-white py-2 rounded text-sm font-medium">Iniciar sesión</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center bg-sigo-orange text-white py-2 rounded text-sm font-bold">Registrarme</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
