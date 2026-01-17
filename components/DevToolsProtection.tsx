'use client';

import { useEffect, useState, useRef } from 'react';

const DEV_TOOLS_CODE = '1234';
const STORAGE_KEY = 'devtools_unlocked';

export default function DevToolsProtection() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    // Check if already unlocked in this session
    isUnlockedRef.current = sessionStorage.getItem(STORAGE_KEY) === 'true';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      const isCombination = 
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'));

      if (isCombination && !isUnlockedRef.current) {
        e.preventDefault();
        setIsPromptOpen(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Only prevent right-click if not unlocked
      if (!isUnlockedRef.current) {
        e.preventDefault();
      }
    };

    // Detect if DevTools is open by monitoring window dimensions
    const detectDevTools = () => {
      if (!isUnlockedRef.current) {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          setIsPromptOpen(true);
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Check for DevTools every 1 second
    const interval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(interval);
    };
  }, []);

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputCode === DEV_TOOLS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      isUnlockedRef.current = true; // Update ref immediately
      setIsPromptOpen(false);
      setInputCode('');
      setAttempts(0);
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.innerHTML = '✅ Developer tools unlocked for this session';
      successMsg.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:1rem 1.5rem;border-radius:0.5rem;font-weight:600;z-index:99999;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } else {
      setAttempts(attempts + 1);
      setInputCode('');
      
      if (attempts >= 2) {
        // After 3 failed attempts, redirect to home
        alert('Too many failed attempts. Redirecting...');
        window.location.href = '/';
      }
    }
  };

  if (!isPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Developer Tools Locked</h2>
          <p className="mt-2 text-sm text-gray-600">
            This website's developer tools are protected. Please enter the access code to continue.
          </p>
        </div>

        <form onSubmit={handleSubmitCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
              Access Code
            </label>
            <input
              id="code"
              type="password"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center text-xl font-mono tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••"
              maxLength={4}
              autoFocus
              required
            />
          </div>

          {attempts > 0 && (
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-sm font-semibold text-red-800">
                ❌ Incorrect code. {3 - attempts} attempt(s) remaining.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPromptOpen(false);
                setInputCode('');
              }}
              className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> This protection helps secure sensitive information. If you need access, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
