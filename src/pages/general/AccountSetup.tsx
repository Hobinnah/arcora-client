import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../apis/useAccount';
import './AccountSetup.css';

const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  promotions: z.boolean(),
  agreement: z.boolean().refine((value) => value, 'You must accept the Arcora terms'),
});

type AccountForm = z.infer<typeof accountSchema>;

const cities = [
  { name: 'Toronto', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Vancouver', image: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Montreal', image: 'https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Calgary', image: 'https://images.unsplash.com/photo-1561134643-668f9057cce4?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Edmonton', image: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Ottawa', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Halifax', image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Victoria', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Saskatoon', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Winnipeg', image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Quebec City', image: 'https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Hamilton', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Kelowna', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Waterloo', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'St. John\'s', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&h=600&q=80' },
];

interface AccountSetupProps {
  emailAddress: string;
  role?: string;
}

export default function AccountSetup({ emailAddress, role }: AccountSetupProps) {
  const navigate = useNavigate();
  const loginTarget = role === 'landlord' ? '/login?redirect_url=/become-a-host' : '/login';
  const { registerUser, isLoading } = useAccount();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { promotions: true, agreement: false },
  });

  const onSubmit = async (data: AccountForm) => {
    setSubmitError('');
    try {
      await registerUser({
        userName: emailAddress.split('@')[0],
        emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.password,
        roles: role ? [role] : undefined,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create your account.');
    }
  };

  if (submitted) return <main className="account-setup-page"><div className="account-setup-poster-bg" aria-hidden="true"><div className="account-setup-poster-grid">{cities.map((city, i) => <div className={`account-setup-poster-card ${i === 4 || i === 7 || i === 8 ? 'account-setup-poster-card-bottom' : ''}`} key={i}><img src={city.image} alt="" /><span>{city.name}</span></div>)}</div></div><section className="account-setup-card"><div className="account-setup-mark">a</div><h1>Account created</h1><p>Your Arcora account is ready. You can now find a home or become a landlord.</p><button type="button" onClick={() => navigate(loginTarget)}>Continue to login</button></section></main>;

  return <main className="account-setup-page"><div className="account-setup-poster-bg" aria-hidden="true"><div className="account-setup-poster-grid">{cities.map((city, i) => <div className={`account-setup-poster-card ${i === 4 || i === 7 || i === 8 ? 'account-setup-poster-card-bottom' : ''}`} key={i}><img src={city.image} alt="" /><span>{city.name}</span></div>)}</div></div><section className="account-setup-card">
    <button className="account-setup-back" type="button" onClick={() => navigate(loginTarget)}>←</button>
    <h1>Let’s create your account</h1>
    <p className="account-setup-subtitle">This information is required to book or host.</p>
    {submitError && <div className="account-setup-error" role="alert">{submitError}</div>}
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset><legend>Legal name</legend><div className="account-setup-name"><input {...register('firstName')} placeholder="First name" /><input {...register('lastName')} placeholder="Last name" /></div><small>Make sure it matches the name on your government ID.</small>{(errors.firstName || errors.lastName) && <em>{errors.firstName?.message || errors.lastName?.message}</em>}</fieldset>
      <label>Date of birth<input {...register('dateOfBirth')} type="date" />{errors.dateOfBirth && <em>{errors.dateOfBirth.message}</em>}</label>
      <label>Password<div className="account-setup-password"><input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div>{errors.password && <em>{errors.password.message}</em>}</label>
      <label className="account-setup-promotions"><input {...register('promotions')} type="checkbox" /><span><strong>Send me Arcora news and promotions</strong><small>You can change this preference anytime in account settings.</small></span></label>
      <label className="account-setup-agreement"><input {...register('agreement')} type="checkbox" /><span>By selecting <strong>Agree and continue</strong>, I agree to Arcora’s <a href="#terms">Terms of Service</a>, <a href="#payments">Payments Terms</a>, and <a href="#privacy">Privacy Policy</a>.</span></label>{errors.agreement && <em>{errors.agreement.message}</em>}
      <button className="account-setup-submit" type="submit" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Agree and continue'}</button>
    </form>
  </section></main>;
}
