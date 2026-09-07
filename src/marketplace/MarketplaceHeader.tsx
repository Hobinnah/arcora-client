import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, InfoIcon, MenuIcon, UserPlusIcon } from '../components/Icons';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import VerificationProfileSummary from '../components/VerificationProfileSummary';

interface MarketplaceHeaderProps {
  activeLink?: 'find' | 'how' | '';
  hostingMode?: boolean;
}

export default function MarketplaceHeader({ activeLink = '', hostingMode = false }: MarketplaceHeaderProps) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [languageTab, setLanguageTab] = useState<'language' | 'currency'>('language');
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = auth?.currentUser?.user;
  const profileName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || auth?.currentUser?.name || 'User';
  const profileInitials = profileName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <nav className="marketplace-nav" aria-label="Main navigation">
      <a className="marketplace-brand" href="/" aria-label="Arcora home"><span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span><span>arcora</span></a>
      <div className="marketplace-nav-links">
        <a className={activeLink === 'find' ? 'is-active' : ''} href={activeLink === 'find' ? '#homes' : '/search'} aria-current={activeLink === 'find' ? 'page' : undefined}><HomeIcon /> Find a home</a>
        <a className={activeLink === 'how' ? 'is-active' : ''} href="/#how-it-works"><InfoIcon /> How it works</a>
      </div>
      <div className="marketplace-nav-actions" ref={menuRef}>
        {hostingMode ? <button className="marketplace-renting-button" type="button" onClick={() => navigate('/')}><span className="marketplace-profile-image">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${profileName} profile`} /> : profileInitials}</span><span>Switch to renting</span></button> : <button className="marketplace-link-button" type="button" onClick={() => navigate('/login?redirect_url=/become-a-host')}><UserPlusIcon /> Become a host / landlord</button>}
        {auth?.isAuthenticated && !hostingMode && <button className="marketplace-profile-button" type="button" aria-label={`${profileName} account`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span className="marketplace-profile-image">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${profileName} profile`} /> : profileInitials}</span></button>}
        <button className={`marketplace-account marketplace-menu-trigger ${menuOpen ? 'is-open' : ''}`} type="button" aria-label="Open menu" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}><MenuIcon /></button>
        {menuOpen && <div className="marketplace-menu-popover" role="menu">
          <a href="#help" role="menuitem"><InfoIcon /><span>Help Centre</span></a>
          <a className="marketplace-menu-feature" href="#host" role="menuitem"><UserPlusIcon /><span><strong>Become a host</strong><small>Share your space and earn income.</small></span></a>
          <a href="#refer" role="menuitem"><span>Refer a host</span></a>
          <a href="#cohost" role="menuitem"><span>Find a co-host</span></a>
          <a href="#gift-cards" role="menuitem"><span>Gift cards</span></a>
          {auth?.isAuthenticated && <VerificationProfileSummary />}
          <div className="marketplace-menu-divider" />
          {auth?.isAuthenticated ? <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); auth.handleLogout().then(() => navigate('/')); }}><span>Log out</span></button> : <a href="/login" role="menuitem"><span>Log in or sign up</span></a>}
        </div>}
      </div>
      {languageModalOpen && <div className="marketplace-language-overlay" onClick={() => setLanguageModalOpen(false)}><section className="marketplace-language-modal" role="dialog" aria-modal="true" aria-label="Language and region settings" onClick={(event) => event.stopPropagation()}><button type="button" className="marketplace-language-close" aria-label="Close" onClick={() => setLanguageModalOpen(false)}>×</button><div className="marketplace-language-tabs"><button type="button" className={languageTab === 'language' ? 'is-selected' : ''} onClick={() => setLanguageTab('language')}>Language and region</button><button type="button" className={languageTab === 'currency' ? 'is-selected' : ''} onClick={() => setLanguageTab('currency')}>Currency</button></div>{languageTab === 'language' ? <div className="marketplace-language-content"><div className="marketplace-translation"><strong>Translation</strong><small>Automatically translate descriptions and reviews to English.</small><span>✓</span></div><h2>Suggested language and region</h2><p><strong>English</strong><small>United Kingdom</small></p><h2>Choose a language and region</h2><div className="marketplace-language-grid">{[['English', 'United States'], ['Azərbaycan dili', 'Azərbaycan'], ['Bahasa Indonesia', 'Indonesia'], ['Bosanski', 'Bosna i Hercegovina'], ['Català', 'Espanya'], ['Čeština', 'Česká republika'], ['Dansk', 'Danmark'], ['Deutsch', 'Deutschland'], ['English', 'Australia'], ['English', 'Canada'], ['English', 'Ireland'], ['English', 'New Zealand'], ['Español', 'Argentina'], ['Español', 'Chile'], ['Español', 'España']].map(([language, region]) => <button type="button" key={`${language}-${region}`} onClick={() => setLanguageModalOpen(false)}>{language}<small>{region}</small></button>)}</div></div> : <div className="marketplace-language-content"><h2>Choose a currency</h2><div className="marketplace-language-grid">{[['Canadian dollar', 'CAD – $'], ['Australian dollar', 'AUD – $'], ['Brazilian real', 'BRL – R$'], ['Euro', 'EUR – €'], ['Indian rupee', 'INR – ₹'], ['Japanese yen', 'JPY – ¥'], ['New Zealand dollar', 'NZD – $'], ['Pound sterling', 'GBP – £'], ['Singapore dollar', 'SGD – $'], ['United States dollar', 'USD – $']].map(([currency, symbol]) => <button type="button" key={currency} onClick={() => setLanguageModalOpen(false)}>{currency}<small>{symbol}</small></button>)}</div></div>}</section></div>}
    </nav>
  );
}
