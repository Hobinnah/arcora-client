import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileIcon, GlobeIcon, InfoIcon, MenuIcon, ShieldIcon, StarIcon, UserIcon } from '../components/Icons';
import faceImg from '../assets/face.jpg';
import VerificationProfileSummary from '../components/VerificationProfileSummary';
import './TenantHeader.css';

export default function TenantHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: 'My applications', icon: <FileIcon />, onClick: () => navigate('/applications') },
    { label: 'Language & currency', icon: <GlobeIcon /> },
    { label: 'Help centre', icon: <InfoIcon /> },
    { label: 'Trust & verification', icon: <ShieldIcon />, onClick: () => navigate('/tenant/verification') },
    { label: 'Reviews & ratings', icon: <StarIcon />, onClick: () => navigate('/reviews') },
    { label: 'Account settings', icon: <UserIcon />, onClick: () => navigate('/account-settings') },
  ];

  return (
    <header className="tenant-header">
      <button type="button" className="tenant-header-brand" onClick={() => navigate('/')} aria-label="Arcora home">
        <span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span>
        <span>arcora</span>
      </button>
      <nav className="tenant-header-nav" aria-label="Tenant navigation">
        <button type="button" className={location.pathname === '/' || location.pathname === '/search' ? 'is-active' : ''} onClick={() => navigate('/')}>Find a home</button>
        <button type="button" className={location.pathname.startsWith('/applications') ? 'is-active' : ''} onClick={() => navigate('/applications')}>My applications</button>
      </nav>
      <div className="tenant-header-actions" ref={menuRef}>
        <button type="button" className="tenant-header-host-link" onClick={() => navigate('/login?redirect_url=/become-a-host')}>Become a host / landlord</button>
        <button type="button" className="tenant-header-avatar" aria-label="Tenant profile" onClick={() => setMenuOpen((open) => !open)}><img src={faceImg} alt="" /></button>
        <button type="button" className="tenant-header-menu" aria-label="Open tenant menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MenuIcon /></button>
        {menuOpen && <div className="tenant-header-popover">
          <div className="tenant-header-profile"><span className="tenant-header-avatar"><img src={faceImg} alt="" /></span><span><strong>Obinna Eze</strong><small>Tenant account</small></span></div>
          <VerificationProfileSummary />
          {menuItems.map((item) => <button type="button" key={item.label} onClick={item.onClick}><span>{item.icon}</span>{item.label}</button>)}
        </div>}
      </div>
    </header>
  );
}
