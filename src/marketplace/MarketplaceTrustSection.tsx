import { CreditCardIcon, FileIcon, HomeIcon } from '../components/Icons';

export default function MarketplaceTrustSection() {
  return <section className="marketplace-trust" id="how-it-works">
    <div className="marketplace-trust-intro"><p className="marketplace-eyebrow">A simpler way to rent</p><h2>From searching to settled.</h2><p>One clear path to a home you can stay in, manage, and make your own.</p></div>
    <div className="marketplace-trust-steps">
      <div className="marketplace-trust-step"><div className="marketplace-step-icon"><HomeIcon /></div><span className="marketplace-step-number">01</span><h3>Discover your fit</h3><p>Browse real homes with clear monthly pricing and flexible lease terms.</p></div>
      <div className="marketplace-trust-step"><div className="marketplace-step-icon"><FileIcon /></div><span className="marketplace-step-number">02</span><h3>Apply with confidence</h3><p>Submit one application and keep track of every step in one place.</p></div>
      <div className="marketplace-trust-step"><div className="marketplace-step-icon"><CreditCardIcon /></div><span className="marketplace-step-number">03</span><h3>Settle in simply</h3><p>Sign your lease and automate rent from the account you already use.</p></div>
    </div>
  </section>;
}
