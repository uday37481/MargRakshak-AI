import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal box */}
      <div className="relative w-full max-w-lg p-6 mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-navy-900">
              {title}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="relative p-6 flex-auto max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
