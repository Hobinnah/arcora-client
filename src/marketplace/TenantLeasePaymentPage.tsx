import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, ShieldIcon } from '../components/Icons';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './TenantLeaseExperience.css';

export default function TenantLeasePaymentPage() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [method, setMethod] = useState<'pad' | 'card'>('pad');
  const savePayment = () => { if (authorized) setSaved(true); };
  return <main className="marketplace tenant-lease-page"><TenantHeader /><div className="tenant-lease-context"><button type="button" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>← Lease review</button><span>Rent payments</span></div><section className="tenant-lease-payment-layout">{saved ? <section className="tenant-lease-success"><span className="tenant-lease-success-icon">✓</span><p className="marketplace-eyebrow">Payment method saved</p><h1>Automatic rent is ready.</h1><p>Your landlord can now collect rent according to the signed lease terms. You will receive notice before scheduled charges.</p><div className="tenant-lease-success-meta"><span>Primary method</span><strong>{method === 'pad' ? 'PAD / ACSS debit' : 'Card ending in 4242'}</strong><span>Charge timing</span><strong>According to lease</strong><span>Lease</span><strong>Ready to sign</strong></div><button type="button" className="tenant-lease-primary" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>Return to lease review</button></section> : <div className="tenant-lease-payment-main"><p className="marketplace-eyebrow">Automatic rent payments</p><h1>Set up your rent payments.</h1><p className="tenant-lease-lead">Choose a payment method for recurring rent. You will not be charged during setup.</p><div className="tenant-lease-payment-methods"><button type="button" className={method === 'pad' ? 'is-selected' : ''} onClick={() => setMethod('pad')}><strong>PAD / ACSS debit</strong><span>Connect a Canadian bank account for recurring rent.</span></button><button type="button" className={method === 'card' ? 'is-selected' : ''} onClick={() => setMethod('card')}><strong>Card</strong><span>Use a card for recurring rent according to the lease.</span></button></div><div className="tenant-lease-payment-provider"><ShieldIcon /><div><strong>Secure setup through Stripe</strong><p>Arcora does not store your bank or card credentials. You will complete secure payment setup in the payment provider flow.</p></div></div><label className="tenant-lease-consent"><input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} /><span>I authorize recurring rent payments using my selected method according to the lease terms. I understand this does not charge me today.</span></label><button type="button" className="tenant-lease-primary" disabled={!authorized} onClick={savePayment}><CheckIcon /> Save payment authorization</button></div>}</section><MarketplaceFooter /></main>;
}
