import { GlobeIcon } from '../components/Icons';
import MarketplaceTrustSection from './MarketplaceTrustSection';

export default function MarketplaceFooter() {
  return (
    <><MarketplaceTrustSection /><footer className="marketplace-footer">
      <div className="marketplace-footer-columns">
        <div className="marketplace-footer-column"><h3>Support</h3><a href="#help">Help Centre</a><a href="#safety">Safety and trust</a><a href="#accessibility">Accessibility support</a><a href="#cancellations">Cancellation options</a><a href="#contact">Contact Arcora</a></div>
        <div className="marketplace-footer-column"><h3>Hosting</h3><a href="#host">Arcora your home</a><a href="#resources">Hosting resources</a><a href="#responsibly">Hosting responsibly</a><a href="#cohost">Find a co-host</a><a href="#landlord">Become a landlord</a></div>
        <div className="marketplace-footer-column"><h3>Arcora</h3><a href="#about">About us</a><a href="#news">Newsroom</a><a href="#careers">Careers</a><a href="#terms">Terms and policies</a><a href="#partners">Partner with Arcora</a></div>
      </div>
      <div className="marketplace-footer-bottom"><div className="marketplace-footer-legal"><span>© 2026 Arcora, Inc.</span><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#sitemap">Sitemap</a></div><div className="marketplace-footer-locales"><button type="button"><GlobeIcon /> English (CA)</button><button type="button">$ CAD</button><button className="marketplace-social" type="button" aria-label="Arcora social updates">f</button><button className="marketplace-social" type="button" aria-label="Arcora on X">X</button><button className="marketplace-social" type="button" aria-label="Arcora on Instagram">◎</button></div></div>
    </footer></>
  );
}
