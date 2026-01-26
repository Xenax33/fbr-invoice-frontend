'use client';

import React, { useState } from 'react';
import { useMfa } from '@/hooks/useMfa';
import BackupCodesDisplay from './BackupCodesDisplay';

interface MfaEnrollmentProps {
  accessToken: string;
  onSuccess?: (backupCodes: string[]) => void;
  onCancel?: () => void;
}

/**
 * MFA Enrollment Component
 * Handles QR code display and TOTP verification for MFA setup
 */
export default function MfaEnrollment({ accessToken, onSuccess, onCancel }: MfaEnrollmentProps) {
  const { issueMfaSecret, enableMfa, loading, error } = useMfa();
  const [step, setStep] = useState<'init' | 'qr' | 'verify' | 'backup'>('init');
  const [qrData, setQrData] = useState<{
    secret: string;
    otpauthUrl: string;
    qrDataUrl: string;
  } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  /**
   * Generate and display QR code
   */
  const handleGenerateQr = async () => {
    setVerificationError('');
    const secret = await issueMfaSecret(accessToken);
    if (secret) {
      setQrData(secret);
      setStep('qr');
    }
  };

  /**
   * Verify TOTP and enable MFA
   */
  const handleVerifyAndEnable = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setVerificationError('Please enter a valid 6-digit code');
      return;
    }

    if (!qrData) {
      setVerificationError('QR data missing. Please start over.');
      return;
    }

    setVerificationError('');
    const result = await enableMfa(accessToken, totpCode);

    if (result) {
      setBackupCodes(result.backupCodes);
      setStep('backup');
      setTotpCode('');
    } else {
      setVerificationError('Invalid code. Please check your authenticator app and try again.');
    }
  };

  /**
   * Handle backup codes saved
   */
  const handleBackupCodesSaved = () => {
    if (onSuccess) {
      onSuccess(backupCodes);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setStep('init');
    setQrData(null);
    setTotpCode('');
    setBackupCodes([]);
    setVerificationError('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="mfa-enrollment">
      <style jsx>{`
        .mfa-enrollment {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .enrollment-step {
          display: none;
        }

        .enrollment-step.active {
          display: block;
        }

        .step-header {
          margin-bottom: 24px;
        }

        .step-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .step-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .qr-container {
          text-align: center;
          margin: 24px 0;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .qr-image {
          max-width: 100%;
          height: auto;
          margin-bottom: 16px;
        }

        .manual-entry-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .manual-entry-toggle {
          color: #0066cc;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 12px;
          display: inline-block;
        }

        .manual-entry-toggle:hover {
          text-decoration: underline;
        }

        .secret-code {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 12px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          letter-spacing: 2px;
          text-align: center;
          word-break: break-all;
          margin: 12px 0;
        }

        .code-input-section {
          margin: 24px 0;
        }

        .code-input-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .code-input {
          width: 100%;
          padding: 12px;
          font-size: 18px;
          letter-spacing: 4px;
          text-align: center;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .code-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .code-input::placeholder {
          color: #ccc;
          letter-spacing: normal;
        }

        .error-message {
          color: #d32f2f;
          font-size: 14px;
          margin-top: 8px;
          padding: 8px 12px;
          background: #ffebee;
          border-radius: 4px;
          display: none;
        }

        .error-message.visible {
          display: block;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0052a3;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .counter-timer {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
        }
      `}</style>

      {/* Step 1: Initial */}
      <div className={`enrollment-step ${step === 'init' ? 'active' : ''}`}>
        <div className="step-header">
          <h2 className="step-title">Enable Two-Factor Authentication</h2>
          <p className="step-description">
            Protect your admin account with TOTP-based two-factor authentication. You'll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
          </p>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleGenerateQr}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading && <span className="loading-spinner"></span>}
            Get Started
          </button>
        </div>

        {error && (
          <div className={`error-message visible`}>
            {error.message}
          </div>
        )}
      </div>

      {/* Step 2: QR Code Display */}
      <div className={`enrollment-step ${step === 'qr' ? 'active' : ''}`}>
        <div className="step-header">
          <h2 className="step-title">Scan QR Code</h2>
          <p className="step-description">
            Open your authenticator app and scan this QR code. If you can't scan, you can enter the secret manually.
          </p>
        </div>

        {qrData && (
          <>
            <div className="qr-container">
              <img
                src={qrData.qrDataUrl}
                alt="TOTP QR Code"
                className="qr-image"
              />
              <p style={{ fontSize: '12px', color: '#999' }}>
                Scan this code with your authenticator app
              </p>
            </div>

            <div className="manual-entry-section">
              <button
                className="manual-entry-toggle"
                onClick={() => setShowManualEntry(!showManualEntry)}
              >
                {showManualEntry ? 'Hide' : 'Can\'t scan?'} Enter Manually
              </button>

              {showManualEntry && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    App: FBR Invoice Admin
                  </p>
                  <div className="secret-code">
                    {qrData.secret}
                  </div>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    Enter this code in your authenticator app
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="code-input-section">
          <label className="code-input-label">
            Enter the 6-digit code from your authenticator app:
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="code-input"
            value={totpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setTotpCode(value);
              setVerificationError('');
            }}
            autoFocus
          />
          {verificationError && (
            <div className={`error-message visible`}>
              {verificationError}
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={handleVerifyAndEnable}
            disabled={loading || totpCode.length !== 6}
          >
            {loading && <span className="loading-spinner"></span>}
            Verify & Enable
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Step 3: Backup Codes */}
      <div className={`enrollment-step ${step === 'backup' ? 'active' : ''}`}>
        <div className="step-header">
          <h2 className="step-title">Save Backup Codes</h2>
          <p className="step-description">
            Store these codes in a safe place. Each code can be used once if you lose access to your authenticator app.
          </p>
        </div>

        <BackupCodesDisplay
          codes={backupCodes}
          onContinue={handleBackupCodesSaved}
        />
      </div>
    </div>
  );
}
