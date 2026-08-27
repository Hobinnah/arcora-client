{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { decodeJWTToken, debugTokenStructure } from '../apis/helpers';
import { env } from '../env';

// Validation schema for 2FA form
const twoFactorSchema = z.object({
  otpCode: z
    .string()
    .min(6, "OTP code must be 6 digits")
    .max(6, "OTP code must be 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only numbers")
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

interface TwoFactorAuthProps {
  emailAddress: string;
  tempToken: string;
  onSuccess: (finalToken: string) => void;
  onCancel: () => void;
  message?: string;
  embedded?: boolean;
  onVerifyCode?: (payload: { emailAddress: string; token: string; otpCode: string }) => Promise<string>;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  emailAddress,
  tempToken,
  onSuccess,
  onCancel,
  message = "Please enter the 6-digit code sent to your email",
  embedded = false,
  onVerifyCode
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    mode: 'onChange'
  });
  const otpCode = watch('otpCode', '');

  // Handle form submission with client-side validation
  const onSubmit = async (data: TwoFactorFormData) => {
    try {
      // Validate temp token format before attempting to decode
      if (!tempToken || typeof tempToken !== 'string') {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid session. Please try logging in again.'
        });
        return;
      }

      // Preferred flow: verify OTP with backend using email + token + otpCode.
      if (onVerifyCode) {
        const finalToken = await onVerifyCode({ emailAddress, token: tempToken, otpCode: data.otpCode });
        onSuccess(finalToken);
        return;
      }

      // Legacy fallback flow: OTP is embedded in token payload.
      debugTokenStructure(tempToken);

      // Check if token contains the expected delimiter for legacy embedded-code format
  if (!tempToken.includes(env.TOKEN_2FA_DELIMITER)) {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid verification token format. Please try logging in again.'
        });
        return;
      }

      // Decode the JWT token to extract the OTP
      const decodedToken = decodeJWTToken(tempToken, true);
      
      // Validate that we have the required data
      if (!decodedToken.otp) {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid token format. Please try logging in again.'
        });
        return;
      }

      // Check OTP expiry if provided
      if (decodedToken.otpExpiryTime) {
        const expiryTime = new Date(decodedToken.otpExpiryTime).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime > expiryTime) {
          setError('otpCode', {
            type: 'manual',
            message: 'OTP has expired. Please request a new code.'
          });
          return;
        }
      }

      // Compare user-entered OTP with the one from the token
      if (data.otpCode === decodedToken.otp) {
        // OTP is valid, proceed with login completion
        // console.log('OTP validation successful!'); // SECURITY: 2FA flow logging
        // console.log('Decoded token for final auth:', decodedToken.token); // SECURITY: Contains sensitive token
        // console.log('Final token length:', decodedToken.token?.length);
        // console.log('Final token starts with:', decodedToken.token?.substring(0, 50)); // SECURITY: Contains partial token
        
        // Return the original token (not the temp token) for final authentication
        onSuccess(decodedToken.token);
      } else {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid OTP code. Please check the code and try again.'
        });
      }
    } catch (err) {
      console.error('2FA validation error:', err);
      
      // Provide more specific error messages based on the error type
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      if (onVerifyCode && errorMessage) {
        setError('otpCode', {
          type: 'manual',
          message: errorMessage
        });
        return;
      }
      
      if (errorMessage.includes('Invalid token encoding') || errorMessage.includes('not correctly encoded')) {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid token encoding. Please try logging in again.'
        });
      } else if (errorMessage.includes('Invalid verification token format')) {
        setError('otpCode', {
          type: 'manual',
          message: 'Invalid verification token format. Please try logging in again.'
        });
      } else {
        setError('otpCode', {
          type: 'manual',
          message: 'Failed to validate OTP. Please try again or request a new code.'
        });
      }
    }
  };

  // Resend OTP code - redirect back to login to get new token
  const handleResendCode = async () => {
    setIsResending(true);
    setResendMessage('Please return to login to request a new code.');
    
    // Since the OTP is embedded in the server token, we need to go back to login
    // to get a fresh token with a new OTP
    setTimeout(() => {
      onCancel(); // This will take user back to login
    }, 2000);
  };

  const cardContent = (
    <>
      {/* Header */}
      <div className="reset-password-header">
        <div className="reset-password-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"/>
          </svg>
        </div>
        <h1 className="reset-password-title">Email address Confirmation</h1>
        <p className="reset-password-subtitle">{message}</p>
      </div>

      {/* Email info */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        padding: '0.75rem',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#374151',
          fontWeight: '500'
        }}>
          Code sent to: <strong>{emailAddress}</strong>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">

        {/* OTP Code Input */}
        <div className="form-group">
          <label htmlFor="otpCode" className="form-label">
            Enter 6-Digit Code
          </label>
          <input
            {...register('otpCode')}
            type="text"
            id="otpCode"
            className="form-input"
            placeholder="000000"
            maxLength={6}
            autoComplete="one-time-code"
            style={{
              textAlign: 'center',
              fontSize: '1.25rem',
              letterSpacing: '0.5rem',
              fontFamily: 'monospace'
            }}
          />
          {errors.otpCode && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {errors.otpCode.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || otpCode.length !== 6}
          className="reset-password-button"
        >
          {isSubmitting ? (
            <>
              <div className="button-spinner"></div>
              Verifying...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Verify Code
            </>
          )}
        </button>

        {/* Resend Code */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="link-button"
            style={{
              background: 'none',
              border: 'none',
              color: '#0891b2',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
          </button>

          {resendMessage && (
            <p style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.875rem',
              color: resendMessage.includes('Failed') ? '#dc2626' : '#059669'
            }}>
              {resendMessage}
            </p>
          )}
        </div>

        {/* Cancel Link */}
        <div className="sign-in-link" style={{ marginTop: '1.5rem' }}>
          <span>Changed your mind? </span>
          <button
            type="button"
            onClick={onCancel}
            className="link-button"
          >
            Back to Login
          </button>
        </div>
      </form>
    </>
  );

  if (embedded) {
    return <div className="reset-password-card">{cardContent}</div>;
  }

  return (
    <div className="reset-password-container">
      {/* Background geometric patterns */}
      <div className="reset-password-background">
        <div className="geometric-pattern pattern-1"></div>
        <div className="geometric-pattern pattern-2"></div>
        <div className="geometric-pattern pattern-3"></div>
      </div>

      {/* Logo */}
      <div className="reset-password-logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 0L24.4721 15.5279L40 20L24.4721 24.4721L20 40L15.5279 24.4721L0 20L15.5279 15.5279L20 0Z" fill="white"/>
        </svg>
        <span>Netvilleplus</span>
      </div>

      {/* Main card */}
      <div className="reset-password-card">
        {cardContent}
      </div>
    </div>
  );
};

export default TwoFactorAuth;