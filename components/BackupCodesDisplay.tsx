"use client";

import React, { useState } from 'react';

interface BackupCodesDisplayProps {
  codes: string[];
  onContinue: () => void;
}

/**
 * Backup Codes Display Component
 * Shows codes and allows copying or downloading
 */
export default function BackupCodesDisplay({
  codes,
  onContinue,
}: BackupCodesDisplayProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copy codes to clipboard
   */
  const handleCopyCodes = async () => {
    try {
      const text = codes.join('\n');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy codes:', error);
      alert('Failed to copy codes. Please try again.');
    }
  };

  /**
   * Download codes as text file
   */
  const handleDownloadCodes = () => {
    try {
      const text = `FBR Invoice Admin - Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nKeep these codes safe. Each code can be used once.\n\n${codes.map((code, i) => `${i + 1}. ${code}`).join('\n')}`;

      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fbr-mfa-backup-codes.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download codes:', error);
      alert('Failed to download codes. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-50 shadow-inner shadow-amber-900/30">
        <span className="text-lg leading-none">⚠️</span>
        <div>
          <p className="font-semibold text-amber-50">Save these backup codes</p>
          <p className="text-amber-100/90">Store offline. They bypass your authenticator if you lose your device.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/40">
        <div className="grid gap-3 sm:grid-cols-2">
          {codes.map((code, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center font-mono text-sm tracking-[0.2em] text-emerald-100 shadow-inner shadow-black/30"
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:border-emerald-200/60 hover:bg-emerald-500/10"
          onClick={handleCopyCodes}
          title="Copy all codes to clipboard"
        >
          {copied ? 'Copied to clipboard' : 'Copy codes'}
        </button>
        <button
          className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:border-emerald-200/60 hover:bg-emerald-500/10"
          onClick={handleDownloadCodes}
          title="Download codes as a text file"
        >
          Download .txt
        </button>
        <button
          className="flex-[1.4] min-w-[160px] rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-900/35 transition hover:brightness-110"
          onClick={onContinue}
          title="I have saved my backup codes"
        >
          I've saved my codes
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-stone-200/80 shadow-inner shadow-black/30">
        Each backup code is single-use. After using one, it is burned and cannot be reused.
      </div>
    </div>
  );
}
