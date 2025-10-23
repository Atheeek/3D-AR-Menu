'use client';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function PolishedModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Glassmorphism Effect Container */}
      <div
        className="bg-white border-gray-700/50 rounded-xl shadow-2xl w-full max-w-lg z-50 overflow-hidden animate-fade-in-up backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex bg-white justify-between items-center px-6 py-4 border-b border-">
          <h2 className="text-xl font-semibold text-brand-text">{title}</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text text-2xl">&times;</button>
        </div>
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}