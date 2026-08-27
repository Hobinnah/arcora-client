import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { requestLoginCode, verifyLoginCode } from '../../apis/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useLocation, useNavigate } from 'react-router-dom';
import TwoFactorAuth from '../../components/TwoFactorAuth';
import { MenuIcon } from '../../components/Icons';
import MarketplaceFooter from '../../marketplace/MarketplaceFooter';
import AccountSetup from './AccountSetup';
import './LoginPageNew.css';

const CODE_SENT_REGEX = /verification code has been sent|code has been sent|sent to your email/i;
const LOGIN_SUCCESS_NO_TOKEN_SENTINEL = '__LOGIN_SUCCESS_NO_TOKEN__';

const loginSchema = z.object({
  username: z.string().min(1, 'Email is required').email('Please enter a valid email address').transform((e) => e.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  rememberMe: z.boolean(),
});
type FormFields = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isEmailContinuing, setIsEmailContinuing] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{ emailAddress: string; tempToken: string; message?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect_url') || '';
  const registrationRole = redirectUrl.includes('become-a-host') ? 'landlord' : undefined;
  const { register, handleSubmit, setError, getValues, formState: { errors, isSubmitting } } = useForm<FormFields>({ defaultValues: { username: '', password: '', rememberMe: false }, resolver: zodResolver(loginSchema), mode: 'onBlur' });
  const auth = useContext(AuthContext);
  const { redirectToUserDashboard } = useAuthRedirect();

  const onSubmitHandler = useCallback(async (data: FormFields) => {
    try {
      if (!auth?.handleLogin) throw new Error('Authentication service unavailable.');
      const response = await auth.handleLogin(data.username, data.password);
      if (response?.requiresTwoFactor) {
        const token = response.tempToken || response.accessToken;
        if (!token) throw new Error('2FA required but no token provided.');
        setTwoFactorData({ emailAddress: data.username, tempToken: token, message: response.twoFactorMessage || 'Enter the code sent to your email' });
        setShow2FA(true);
        return;
      }
      if (response?.isLoginSuccessful && response.roles) { redirectToUserDashboard(response.roles, data.rememberMe); }
      else throw new Error('Login failed. Please check your credentials.');
    } catch (error) { setError('root', { type: 'manual', message: error instanceof Error ? error.message : 'An error occurred.' }); }
  }, [auth, redirectToUserDashboard, setError]);

  const handle2FASuccess = useCallback(async (finalToken: string) => {
    try {
      if (finalToken === LOGIN_SUCCESS_NO_TOKEN_SENTINEL) {
        setShow2FA(false);
        setShowAccountSetup(true);
        return;
      }

      if (auth?.complete2FA && twoFactorData) { await auth.complete2FA(finalToken); setShow2FA(false); setShowAccountSetup(true); }
    } catch { setError('root', { type: 'manual', message: 'Authentication failed. Please try again.' }); setShow2FA(false); setTwoFactorData(null); }
  }, [auth, twoFactorData, redirectToUserDashboard, setError]);

  const handleVerifyCode = useCallback(async ({ emailAddress, token, otpCode }: { emailAddress: string; token: string; otpCode: string }) => {
    const result = await verifyLoginCode(emailAddress, token, otpCode);
    if (result.isLoginSuccessful && !result.finalToken) {
      return LOGIN_SUCCESS_NO_TOKEN_SENTINEL;
    }
    return result.finalToken;
  }, []);

  const handleGoogleLogin = useCallback(() => { alert('Google login coming soon!'); }, []);

  const handleEmailContinue = async () => {
    const email = getValues('username');
    if (!email || !email.includes('@')) {
      setError('username', { type: 'manual', message: 'Please enter a valid email' });
      return;
    }

    setIsEmailContinuing(true);

    try {
      const result = await requestLoginCode(email);
      if (result.emailExists) {
        setStep('password');
        return;
      }

      if (result.verificationToken) {
        setTwoFactorData({ emailAddress: email, tempToken: result.verificationToken, message: result.message || 'Enter the code sent to your email' });
        setShow2FA(true);
        return;
      }

      if (result.message && CODE_SENT_REGEX.test(result.message)) {
        throw new Error('Verification code was sent, but verificationToken is missing in the response. Please retry or contact support.');
      }

      throw new Error(result.message || 'Unable to continue with this email.');
    } catch (error) {
      setError('root', { type: 'manual', message: error instanceof Error ? error.message : 'Unable to continue with this email.' });
    } finally {
      setIsEmailContinuing(false);
    }
  };

  if (showAccountSetup && twoFactorData) return <AccountSetup emailAddress={twoFactorData.emailAddress} role={registrationRole} />;

  return (
    <div className="login-page marketplace">
      <nav className="login-nav">
        <a className="login-brand" href="/"><span className="login-brand-mark"><span>a</span></span><span>arcora</span></a>
        <div className="login-nav-right"><button type="button" onClick={() => navigate('/')}>Become a host / landlord</button><button className="login-nav-menu" type="button" aria-label="Menu"><MenuIcon /></button></div>
      </nav>

      <div className="login-hero">
        <div className="login-poster-bg" aria-hidden="true">
          <div className="login-poster-grid">
            {cities.map((city, i) => <div className={`login-poster-card ${i === 4 || i === 7 || i === 8 ? 'login-poster-card-bottom' : ''}`} key={i}><img src={city.image} alt="" /><span>{city.name}</span></div>)}
          </div>
        </div>

        <div className="login-modal">
          {!show2FA && (
            <>
              <div className="login-modal-logo"><span className="login-modal-mark"><span>a</span></span></div>
              <h1>Log in or sign up</h1>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                {errors.root && <div className="login-error" role="alert">{errors.root.message}</div>}

                {step === 'email' && <>
                  <div className="login-field"><input {...register('username')} type="email" placeholder="Email address" autoComplete="email" disabled={isEmailContinuing} /></div>
                  {errors.username && <small className="login-field-error">{errors.username.message}</small>}
                  <button className={`login-submit ${isEmailContinuing ? 'is-loading' : ''}`} type="button" onClick={handleEmailContinue} disabled={isEmailContinuing} aria-busy={isEmailContinuing}>
                    {isEmailContinuing ? <><span className="login-submit-spinner" aria-hidden="true"></span>Processing...</> : 'Continue'}
                  </button>
                </>}

                {step === 'password' && <>
                  <div className="login-field login-field-readonly"><span>{getValues('username')}</span><button type="button" className="login-change-email" onClick={() => setStep('email')}>Change</button></div>
                  <div className="login-field">
                    <div className="login-password-wrap"><input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" autoFocus /><button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '◡' : '◠'}</button></div>
                  </div>
                  {errors.password && <small className="login-field-error">{errors.password.message}</small>}
                  <label className="login-remember"><input {...register('rememberMe')} type="checkbox" /><span>Remember me</span></label>
                  <button className="login-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Continue'}</button>
                  <button type="button" className="login-forgot" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
                </>}
              </form>
              <div className="login-divider"><span>or</span></div>
              <button className="login-social" type="button" onClick={handleGoogleLogin}><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Continue with Google</button>
              <p className="login-register">Don't have an account? <button type="button" onClick={() => navigate('/register')}>Sign up</button></p>
            </>
          )}

          {show2FA && twoFactorData && (
            <TwoFactorAuth
              embedded
              emailAddress={twoFactorData.emailAddress}
              tempToken={twoFactorData.tempToken}
              message={twoFactorData.message}
              onVerifyCode={handleVerifyCode}
              onSuccess={handle2FASuccess}
              onCancel={() => {
                setShow2FA(false);
                setTwoFactorData(null);
                setStep('email');
              }}
            />
          )}
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
}
