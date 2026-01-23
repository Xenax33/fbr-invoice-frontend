'use client';

import { useLoading } from '@/contexts/LoadingContext';

export default function GlobalLoader() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      {/* Typing Indicator */}
      <div className="typing-indicator mx-auto mb-6">
        <div className="typing-circle"></div>
        <div className="typing-circle"></div>
        <div className="typing-circle"></div>
        <div className="typing-shadow"></div>
        <div className="typing-shadow"></div>
        <div className="typing-shadow"></div>
      </div>

      <style jsx>{`
        .typing-indicator {
          width: 60px;
          height: 30px;
          position: relative;
          z-index: 4;
        }

        .typing-circle {
          width: 10px;
          height: 10px;
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          left: 15%;
          transform-origin: 50%;
          animation: typing-circle7124 0.5s alternate infinite ease;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        @keyframes typing-circle7124 {
          0% {
            top: 20px;
            height: 5px;
            border-radius: 50px 50px 25px 25px;
            transform: scaleX(1.7);
          }

          40% {
            height: 10px;
            border-radius: 50%;
            transform: scaleX(1);
          }

          100% {
            top: 0%;
          }
        }

        .typing-circle:nth-child(2) {
          left: 45%;
          animation-delay: 0.2s;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }

        .typing-circle:nth-child(3) {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }

        .typing-shadow {
          width: 8px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.3);
          position: absolute;
          top: 30px;
          transform-origin: 50%;
          z-index: 3;
          left: 15%;
          filter: blur(2px);
          animation: typing-shadow046 0.5s alternate infinite ease;
        }

        @keyframes typing-shadow046 {
          0% {
            transform: scaleX(1.5);
          }

          40% {
            transform: scaleX(1);
            opacity: 0.7;
          }

          100% {
            transform: scaleX(0.2);
            opacity: 0.4;
          }
        }

        .typing-shadow:nth-child(4) {
          left: 45%;
          animation-delay: 0.2s;
        }

        .typing-shadow:nth-child(5) {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
