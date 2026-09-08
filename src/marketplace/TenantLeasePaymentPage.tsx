import { useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, ShieldIcon } from '../components/Icons';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import { useAuth } from '../hooks/useAuth';
import { getTenantByUserID } from '../apis/useTenant';
import {
  createPaymentOnboardingSetupIntent,
  getPaymentOnboardingStatus,
  savePaymentOnboardingMethod,
  startPaymentOnboarding,
} from '../apis/usePaymentOnboarding';
import './TenantLeaseExperience.css';

const stripePromise = (publishableKey: string) => (publishableKey ? loadStripe(publishableKey) : null);

function PaymentCardFields() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="tenant-lease-payment-card-field">
      <label className="tenant-lease-form-field">
        <span>Card details</span>
        <CardElement
          options={{
            style: {
              base: {
                color: '#1f2a2d',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': { color: '#7f8f91' },
              },
            },
          }}
        />
      </label>
      {!stripe || !elements ? (
        <small className="tenant-lease-form-hint">Loading secure card entry…</small>
      ) : null}
    </div>
  );
}

export default function TenantLeasePaymentPage() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [method, setMethod] = useState<'pad' | 'card'>('pad');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    hasVerifiedPad: boolean;
    hasVerifiedCard: boolean;
    padMandateActive: boolean;
    isReady: boolean;
  } | null>(null);
  const [padForm, setPadForm] = useState({
    accountHolderName: '',
    institutionNumber: '',
    transitNumber: '',
    accountNumber: '',
  });
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    if (!currentUser?.user?.id) return;

    getTenantByUserID(currentUser.user.id)
      .then((tenant) => {
        if (tenant?.tenantID) {
          setTenantId(tenant.tenantID);
          return;
        }
        setError('Please complete your tenant profile before setting up rent payments.');
      })
      .catch(() => {
        setError('Unable to find your tenant record. Please complete your profile first.');
      });
  }, [currentUser?.user?.id]);

  useEffect(() => {
    if (!tenantId) return;

    startPaymentOnboarding(tenantId)
      .then((response) => {
        setPublishableKey(response.publishableKey || '');
      })
      .catch(() => {
        setPublishableKey('');
      });

    getPaymentOnboardingStatus(tenantId)
      .then((onboardingStatus) => {
        setStatus(onboardingStatus);
        setSaved(onboardingStatus.isReady);
      })
      .catch(() => {
        setStatus(null);
      });
  }, [tenantId]);

  const refreshStatus = async (nextTenantId: string) => {
    const onboardingStatus = await getPaymentOnboardingStatus(nextTenantId);
    setStatus(onboardingStatus);
    setSaved(onboardingStatus.isReady);
  };

  const savePayment = async () => {
    if (!tenantId) {
      setError('Your tenant record is not available yet.');
      return;
    }

    if (!authorized) {
      setError('Please confirm the authorization before saving your payment method.');
      return;
    }

    if (method === 'pad' && !padForm.accountHolderName.trim()) {
      setError('Please enter the account holder name for your PAD.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const onboarding = await startPaymentOnboarding(tenantId);
      const keyToUse = onboarding.publishableKey || publishableKey;
      setPublishableKey(keyToUse);

      if (method === 'pad') {
        const setup = await createPaymentOnboardingSetupIntent(tenantId, 'PAD');
        const stripe = await loadStripe(setup.publishableKey || keyToUse);
        if (!stripe) {
          throw new Error('Stripe failed to initialize.');
        }

        const { error: stripeError, setupIntent } = await stripe.confirmAcssDebitSetup(setup.clientSecret, {
          payment_method: {
            acss_debit: {
              institution_number: padForm.institutionNumber,
              transit_number: padForm.transitNumber,
              account_number: padForm.accountNumber,
            },
            billing_details: {
              name: padForm.accountHolderName,
              email: currentUser?.user?.email || '',
            },
          },
        });

        if (stripeError) {
          throw new Error(stripeError.message || 'Failed to confirm your PAD setup.');
        }

        const providerPaymentMethodID = String(setupIntent?.payment_method || '');
        if (!providerPaymentMethodID) {
          throw new Error('Stripe did not return a payment method for the PAD setup.');
        }

        await savePaymentOnboardingMethod({
          tenantID: tenantId,
          providerPaymentMethodID,
          methodKind: 'PAD',
        });
      } else {
        const stripe = await loadStripe(keyToUse);
        if (!stripe) {
          throw new Error('Stripe failed to initialize for the card flow.');
        }

        const elements = stripe.elements();
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card entry is not ready yet.');
        }

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: { name: cardName || currentUser?.user?.firstName || 'Tenant' },
        });

        if (stripeError) {
          throw new Error(stripeError.message || 'Failed to tokenize your card.');
        }

        if (!paymentMethod?.id) {
          throw new Error('Stripe did not return a valid payment method for the backup card.');
        }

        await savePaymentOnboardingMethod({
          tenantID: tenantId,
          providerPaymentMethodID: paymentMethod.id,
          methodKind: 'CARD',
        });
      }

      await refreshStatus(tenantId);
    } catch (submitError: any) {
      setError(submitError?.message || 'Payment onboarding could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentStatusText = status
    ? status.isReady
      ? 'Ready for recurring rent collection'
      : 'Pending verification'
    : 'Not started';

  if (!tenantId) {
    return (
      <main className="marketplace tenant-lease-page">
        <TenantHeader />
        <section className="tenant-lease-payment-layout">
          <div className="tenant-lease-payment-main">
            <p className="marketplace-eyebrow">Automatic rent payments</p>
            <h1>Complete your tenant profile first.</h1>
            <p className="tenant-lease-lead">
              We need a tenant record before we can start the Stripe onboarding flow.
            </p>
          </div>
        </section>
        <MarketplaceFooter />
      </main>
    );
  }

  return (
    <main className="marketplace tenant-lease-page">
      <TenantHeader />
      <div className="tenant-lease-context">
        <button type="button" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>← Lease review</button>
        <span>Rent payments</span>
      </div>

      <section className="tenant-lease-payment-layout">
        {saved || status?.isReady ? (
          <section className="tenant-lease-success">
            <span className="tenant-lease-success-icon">✓</span>
            <p className="marketplace-eyebrow">Payment method saved</p>
            <h1>Automatic rent is ready.</h1>
            <p>
              Your landlord can now collect rent according to the signed lease terms. Your
              Stripe setup is active and verified.
            </p>
            <div className="tenant-lease-success-meta">
              <span>Primary method</span>
              <strong>{method === 'pad' ? 'PAD / ACSS debit' : 'Backup card'}</strong>
              <span>Charge timing</span>
              <strong>According to lease</strong>
              <span>Status</span>
              <strong>{paymentStatusText}</strong>
            </div>
            <button type="button" className="tenant-lease-primary" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>
              Return to lease review
            </button>
          </section>
        ) : (
          <div className="tenant-lease-payment-main">
            <p className="marketplace-eyebrow">Automatic rent payments</p>
            <h1>Set up your rent payments.</h1>
            <p className="tenant-lease-lead">
              Choose a payment method for recurring rent. You will not be charged during setup.
            </p>

            <div className="tenant-lease-payment-methods">
              <button type="button" className={method === 'pad' ? 'is-selected' : ''} onClick={() => setMethod('pad')}>
                <strong>PAD / ACSS debit</strong>
                <span>Connect a Canadian bank account for recurring rent.</span>
              </button>
              <button type="button" className={method === 'card' ? 'is-selected' : ''} onClick={() => setMethod('card')}>
                <strong>Card</strong>
                <span>Use a card for recurring rent according to the lease.</span>
              </button>
            </div>

            <div className="tenant-lease-payment-provider">
              <ShieldIcon />
              <div>
                <strong>Secure setup through Stripe</strong>
                <p>
                  Arcora does not store your bank or card credentials. You will complete secure
                  payment setup in Stripe before your lease is active.
                </p>
              </div>
            </div>

            {method === 'pad' ? (
              <div className="tenant-lease-payment-form">
                <label className="tenant-lease-form-field">
                  <span>Account holder name</span>
                  <input
                    value={padForm.accountHolderName}
                    onChange={(event) => setPadForm((current) => ({ ...current, accountHolderName: event.target.value }))}
                    placeholder="Obinna Eze"
                  />
                </label>
                <div className="tenant-lease-form-row">
                  <label className="tenant-lease-form-field">
                    <span>Institution number</span>
                    <input
                      value={padForm.institutionNumber}
                      onChange={(event) => setPadForm((current) => ({ ...current, institutionNumber: event.target.value }))}
                      placeholder="000"
                    />
                  </label>
                  <label className="tenant-lease-form-field">
                    <span>Transit number</span>
                    <input
                      value={padForm.transitNumber}
                      onChange={(event) => setPadForm((current) => ({ ...current, transitNumber: event.target.value }))}
                      placeholder="00000"
                    />
                  </label>
                </div>
                <label className="tenant-lease-form-field">
                  <span>Account number</span>
                  <input
                    value={padForm.accountNumber}
                    onChange={(event) => setPadForm((current) => ({ ...current, accountNumber: event.target.value }))}
                    placeholder="000123456789"
                  />
                </label>
              </div>
            ) : (
              <div className="tenant-lease-payment-form">
                <label className="tenant-lease-form-field">
                  <span>Name on card</span>
                  <input value={cardName} onChange={(event) => setCardName(event.target.value)} placeholder="Obinna Eze" />
                </label>
                {publishableKey ? (
                  <Elements stripe={stripePromise(publishableKey)}>
                    <PaymentCardFields />
                  </Elements>
                ) : (
                  <small className="tenant-lease-form-hint">Loading secure card entry…</small>
                )}
              </div>
            )}

            <label className="tenant-lease-authorization">
              <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
              <span>
                I authorize Arcora to charge my PAD/ACSS bank account first, and use my card as a fallback if needed.
              </span>
            </label>

            {error ? <div className="tenant-lease-error">{error}</div> : null}

            <button type="button" className="tenant-lease-primary" disabled={!authorized || loading || !tenantId} onClick={savePayment}>
              <CheckIcon /> {loading ? 'Saving…' : 'Save payment authorization'}
            </button>

            {status ? (
              <div className="tenant-lease-status-line">
                Stripe onboarding status: <strong>{paymentStatusText}</strong>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <MarketplaceFooter />
    </main>
  );
}
