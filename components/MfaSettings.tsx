'use client';

import React, { useState, useEffect } from 'react';
import { useMfa } from '@/hooks/useMfa';

interface MfaSettingsProps {
  accessToken: string;
  user?: any;
  onMfaStatusChange?: (enabled: boolean) => void;
}

/**
 * MFA Settings Component
 * Manage MFA status in admin profile settings
 */
export default function MfaSettings({ accessToken, user, onMfaStatusChange }: MfaSettingsProps) {
  const { disableMfa, loading, error } = useMfa();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [password, setPassword] = useState('');
  const [disableError, setDisableError] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);

  const isMfaEnabled = user?.mfaEnabled || false;

  /**
   * Handle disable MFA
   */
  const handleDisableMfa = async () => {
    if (!password) {
      setDisableError('Please enter your password');
      return;
    }

    setDisableLoading(true);
    setDisableError('');

    const success = await disableMfa(accessToken, password);
    if (success) {
      setShowDisableModal(false);
      setPassword('');
      onMfaStatusChange?.(false);
    } else if (error) {
      setDisableError(error.message);
    }

    setDisableLoading(false);
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setShowDisableModal(false);
    setPassword('');
    setDisableError('');
  };

  return (
    <div className="mfa-settings">
      <style jsx>{`
        .mfa-settings {
          width: 100%;
        }

        .mfa-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .mfa-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .mfa-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mfa-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .mfa-status.enabled {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .mfa-status.disabled {
          background: #fff3e0;
          color: #f57c00;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .mfa-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .mfa-info-list {
          background: #f5f5f5;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #555;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-icon {
          flex-shrink: 0;
          font-size: 16px;
        }

        .button-group {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 16px;
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

        .btn-primary:hover {
          background: #0052a3;
        }

        .btn-danger {
          background: #ffebee;
          color: #d32f2f;
          border: 1px solid #ffcdd2;
        }

        .btn-danger:hover {
          background: #ffcdd2;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal Styles */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay.active {
          display: flex;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .modal-description {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        .warning-box {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #856404;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .error-message {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          color: #d32f2f;
          padding: 10px 12px;
          font-size: 12px;
          margin-bottom: 16px;
          display: none;
        }

        .error-message.visible {
          display: block;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
        }

        .modal-buttons .btn {
          flex: 1;
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
          width: 14px;
          height: 14px;
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

        @media (max-width: 600px) {
          .mfa-card {
            padding: 16px;
          }

          .mfa-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .button-group {
            flex-direction: column;
          }

          .modal-content {
            width: 95%;
          }
        }
      `}</style>

      <div className="mfa-card">
        <div className="mfa-header">
          <h3 className="mfa-title">
            🔐 Two-Factor Authentication
          </h3>
          <div className={`mfa-status ${isMfaEnabled ? 'enabled' : 'disabled'}`}>
            <span className="status-dot"></span>
            {isMfaEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <p className="mfa-description">
          {isMfaEnabled
            ? 'Your account is protected with two-factor authentication. You are required to enter a verification code when logging in.'
            : 'Enhance your account security by enabling two-factor authentication. You will be required to provide a code from your authenticator app when logging in.'}
        </p>

        {isMfaEnabled ? (
          <div className="mfa-info-list">
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Authenticator app configured and active</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>8 backup codes generated for recovery</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Time-based one-time passwords (TOTP) enabled</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⚠️</span>
              <span>Disabling MFA will reduce account security</span>
            </div>
          </div>
        ) : (
          <div className="mfa-info-list">
            <div className="info-item">
              <span className="info-icon">📱</span>
              <span>Uses your smartphone authenticator app (Google Authenticator, Authy, etc.)</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>Significantly improves account security</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔑</span>
              <span>You'll receive backup codes for account recovery</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span>Adds less than 10 seconds to your login process</span>
            </div>
          </div>
        )}

        <div className="button-group">
          {!isMfaEnabled ? (
            <button className="btn btn-primary">
              Enable Two-Factor Authentication
            </button>
          ) : (
            <>
              <button
                className="btn btn-danger"
                onClick={() => setShowDisableModal(true)}
                disabled={loading}
              >
                Disable MFA
              </button>
            </>
          )}
        </div>
      </div>

      {/* Disable MFA Modal */}
      <div className={`modal-overlay ${showDisableModal ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Disable Two-Factor Authentication?</h3>
            <p className="modal-description">
              This action will disable MFA for your account. You will no longer need to provide a verification code when logging in.
            </p>
          </div>

          <div className="warning-box">
            ⚠️ Warning: Disabling MFA will make your account less secure. We recommend keeping it enabled.
          </div>

          <div className="form-group">
            <label className="form-label">
              Enter your password to confirm
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={disableLoading}
              autoFocus
            />
          </div>

          {disableError && (
            <div className={`error-message visible`}>
              {disableError}
            </div>
          )}

          <div className="modal-buttons">
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={disableLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDisableMfa}
              disabled={disableLoading || !password}
            >
              {disableLoading && <span className="loading-spinner"></span>}
              Disable MFA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
