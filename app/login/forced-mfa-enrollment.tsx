'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMfa } from '@/hooks/useMfa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import BackupCodesDisplay from '@/components/BackupCodesDisplay';

interface ForcedMfaEnrollmentProps {
  userId: string;
  email: string;
  onSuccess?: () => void;
}

type Step = 'qr' | 'verify' | 'backup';

/**
 * Forced MFA Enrollment Component
 * Admins must complete this before accessing the system
 * Used when login returns 403 with requireMfaEnrollment
 */
export default function ForcedMfaEnrollment({ userId, email, onSuccess }: ForcedMfaEnrollmentProps) {
  const router = useRouter();
  const { enrollGetSecret, enrollEnableMfa, loading, error } = useMfa();

  const [step, setStep] = useState<Step>('qr');
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
    const secret = await enrollGetSecret(userId);
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
    const result = await enrollEnableMfa(userId, totpCode);

    if (result) {
      setBackupCodes(result.backupCodes);
      setStep('backup');
      setTotpCode('');
      toast.success('MFA enabled successfully!');
    } else {
      // Log error for debugging
      console.error('MFA enrollment error:', { error, userId, totpCode });
      // Show error from API response if available, otherwise show generic message
      const errorMessage = error?.message || 'Invalid code. Please check your authenticator app and try again.';
      setVerificationError(errorMessage);
      toast.error(`Enrollment failed: ${errorMessage}`);
    }
  };

  /**
   * Handle backup codes saved - redirect to login
   */
  const handleBackupCodesSaved = () => {
    toast.success('Enrollment complete! Please log in with your credentials.');
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200/85">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Admin enrollment</p>
          <p className="mt-1 font-display text-lg text-white">Secure your account</p>
        </div>
        <Link href="/" className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-emerald-100 hover:border-emerald-200/60 hover:bg-emerald-500/10 transition">
          Back to site
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-900/25 backdrop-blur">
        {step === 'qr' ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Step 1 of 3</p>
                <h3 className="font-display text-2xl text-white">Scan the QR code</h3>
                <p className="mt-2 text-sm text-stone-200/80">Use any TOTP authenticator. Switch to manual entry if your camera is blocked.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-100">{email}</div>
            </div>

            {!qrData ? (
              <button
                onClick={handleGenerateQr}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:from-emerald-400 hover:to-emerald-600 disabled:opacity-60"
              >
                {loading ? 'Generating…' : 'Generate QR Code'}
              </button>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center shadow-inner shadow-black/30">
                  <img
                    src={qrData.qrDataUrl}
                    alt="TOTP QR Code"
                    className="mx-auto max-w-[240px] rounded-xl bg-white/90 p-3 shadow-lg shadow-black/25"
                  />
                  <p className="mt-3 text-xs text-stone-200/70">Scan this with your authenticator app</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-stone-200/80">
                  <button
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="inline-flex items-center gap-2 text-emerald-100 hover:text-emerald-50"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    {showManualEntry ? 'Hide manual secret' : "Can't scan? Enter manually"}
                  </button>
                  <span className="text-xs uppercase tracking-[0.25em] text-amber-200">Time-based · 30s</span>
                </div>

                {showManualEntry && qrData && (
                  <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-stone-200/80">Enter this secret into your app</p>
                    <div className="rounded-lg border border-white/10 bg-black/60 px-3 py-3 font-mono text-lg tracking-[0.22em] text-emerald-100 shadow-inner shadow-black/40">
                      {qrData.secret}
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-amber-200">Issuer: FBR Invoice Admin</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-100">Enter the 6-digit code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setTotpCode(value);
                      setVerificationError('');
                    }}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center text-2xl font-semibold tracking-[0.3em] text-white shadow-inner shadow-black/30 outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-400/60 placeholder:text-stone-400"
                    autoFocus
                  />
                  {verificationError && (
                    <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-inner shadow-red-900/30">
                      {verificationError}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleVerifyAndEnable}
                  disabled={loading || totpCode.length !== 6}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-900/35 transition hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? 'Verifying…' : 'Verify & Enable'}
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-inner shadow-red-900/30">
                {error.message}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Step 2 of 3</p>
              <h3 className="font-display text-2xl text-white">Save your backup codes</h3>
              <p className="mt-2 text-sm text-stone-200/80">Store these offline. Each code works once; losing them means opening a support ticket.</p>
            </div>

            <BackupCodesDisplay
              codes={backupCodes}
              onContinue={handleBackupCodesSaved}
            />
          </div>
        )}
      </div>

      <p className="text-center text-xs text-stone-300/80">You can manage MFA later from Account Settings</p>
    </div>
  );
}
