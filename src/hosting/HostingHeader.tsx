import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { BarChartIcon, CalendarIcon, FileIcon, GlobeIcon, InfoIcon, LogOutIcon, MenuIcon, PlusIcon, UserIcon, UsersIcon } from '../components/Icons';
import './HostingPage.css';

export default function HostingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [languageTab, setLanguageTab] = useState<'language' | 'currency'>('language');
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = auth?.currentUser?.user;
  const profileName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || auth?.currentUser?.name || 'User';
  const profileInitials = profileName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); };
  }, []);

  useEffect(() => {
    if (!languageModalOpen) return;
    const toggleTranslation = (event: MouseEvent) => {
      const translation = (event.target as HTMLElement).closest('.hosting-language-modal .hosting-translation');
      if (translation) {
        translation.classList.toggle('is-off', translationEnabled);
        setTranslationEnabled((current) => !current);
      }
    };
    document.addEventListener('click', toggleTranslation);
    return () => document.removeEventListener('click', toggleTranslation);
  }, [languageModalOpen, translationEnabled]);
  useEffect(() => {
    const translation = document.querySelector('.hosting-language-modal .hosting-translation');
    translation?.classList.toggle('is-off', !translationEnabled);
  }, [translationEnabled, languageModalOpen]);

  return (
    <header className="hosting-header">
      <a className="marketplace-brand hosting-brand" href="/" aria-label="Arcora home"><span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span><span>arcora</span></a>
      <nav className="hosting-nav" aria-label="Hosting navigation">
        <button className={location.pathname === '/hosting' ? 'is-active' : ''} type="button" onClick={() => navigate('/hosting')}>Today</button>
        <button className={location.pathname === '/hosting/calendar' ? 'is-active' : ''} type="button" onClick={() => navigate('/hosting/calendar')}><CalendarIcon /> Calendar</button>
        <button className={location.pathname.startsWith('/hosting/listings') ? 'is-active' : ''} type="button" onClick={() => navigate('/hosting/listings')}><FileIcon /> Listings</button>
        <button className={location.pathname === '/hosting/messages' ? 'is-active' : ''} type="button" onClick={() => navigate('/hosting/messages')}><InfoIcon /> Messages</button>
      </nav>
      <div className="hosting-header-actions">
        <button className="hosting-switch" type="button" onClick={() => navigate('/')}>Switch to renting</button>
        <div className="hosting-profile-menu" ref={menuRef}>
          <button className="hosting-profile-trigger" type="button" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {profile?.imageUrl ? <img src={profile.imageUrl} alt={`${profileName} profile`} /> : profileInitials}
          </button>
          <button className={`hosting-menu-trigger ${menuOpen ? 'is-open' : ''}`} type="button" aria-label="Open menu" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MenuIcon /></button>
          {menuOpen && <div className="hosting-menu-popover" role="menu">
            <div className="hosting-menu-profile"><span className="hosting-menu-profile-image">{profile?.imageUrl ? <img src={profile.imageUrl} alt="" /> : profileInitials}</span><span><strong>{profileName}</strong><small>Host account</small></span></div>
            <button type="button" role="menuitem"><BarChartIcon /> <span>Earnings and insights</span></button>
            <button type="button" role="menuitem" onClick={() => navigate('/hosting/listings/new')}><PlusIcon /> <span>Create a new listing</span></button>
            <button type="button" role="menuitem" onClick={() => navigate('/account-settings')}><UserIcon /> <span>Account settings</span></button>
            <button type="button" role="menuitem" onClick={() => { setLanguageModalOpen(true); setMenuOpen(false); }}><GlobeIcon /> <span>Languages and currency</span></button>
            <button type="button" role="menuitem"><FileIcon /> <span>Hosting resources</span></button>
            <button type="button" role="menuitem"><InfoIcon /> <span>Get help</span></button>
            <button type="button" role="menuitem"><UsersIcon /> <span>Find a co-host</span></button>
            <button className="hosting-menu-divider" type="button" role="menuitem" onClick={() => auth?.handleLogout().then(() => navigate('/login'))}><LogOutIcon /> <span>Log out</span></button>
          </div>}
        </div>
      </div>
      {languageModalOpen && <div className="hosting-language-overlay" onClick={() => setLanguageModalOpen(false)}><section className="hosting-language-modal" role="dialog" aria-modal="true" aria-label="Language and region settings" onClick={(event) => event.stopPropagation()}><button type="button" className="hosting-language-close" aria-label="Close" onClick={() => setLanguageModalOpen(false)}>×</button><div className="hosting-language-tabs"><button type="button" className={languageTab === 'language' ? 'is-selected' : ''} onClick={() => setLanguageTab('language')}>Language and region</button><button type="button" className={languageTab === 'currency' ? 'is-selected' : ''} onClick={() => setLanguageTab('currency')}>Currency</button></div>{languageTab === 'language' ? <div className="hosting-language-content"><div className="hosting-translation"><strong>Translation</strong><small>Automatically translate descriptions and reviews to English.</small><span>✓</span></div><h2>Suggested language and region</h2><p><strong>English</strong><small>United Kingdom</small></p><h2>Choose a language and region</h2><div className="hosting-language-grid">{[['English', 'United States'], ['Azərbaycan dili', 'Azərbaycan'], ['Bahasa Indonesia', 'Indonesia'], ['Bosanski', 'Bosna i Hercegovina'], ['Català', 'Espanya'], ['Čeština', 'Česká republika'], ['Dansk', 'Danmark'], ['Deutsch', 'Deutschland'], ['English', 'Australia'], ['English', 'Canada'], ['English', 'Ireland'], ['English', 'New Zealand'], ['Español', 'Argentina'], ['Español', 'Chile'], ['Español', 'España']].map(([language, region]) => <button type="button" key={`${language}-${region}`} onClick={() => setLanguageModalOpen(false)}>{language}<small>{region}</small></button>)}</div></div> : <div className="hosting-language-content"><h2>Choose a currency</h2><div className="hosting-language-grid">{[['Canadian dollar', 'CAD – $'], ['Australian dollar', 'AUD – $'], ['Brazilian real', 'BRL – R$'], ['Euro', 'EUR – €'], ['Indian rupee', 'INR – ₹'], ['Japanese yen', 'JPY – ¥'], ['New Zealand dollar', 'NZD – $'], ['Pound sterling', 'GBP – £'], ['Singapore dollar', 'SGD – $'], ['United States dollar', 'USD – $']].map(([currency, symbol]) => <button type="button" key={currency} onClick={() => setLanguageModalOpen(false)}>{currency}<small>{symbol}</small></button>)}</div></div>}</section></div>}
    </header>
  );
}