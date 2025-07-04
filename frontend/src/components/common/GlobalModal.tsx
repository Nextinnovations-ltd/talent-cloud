import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalModal from "@/state/zustand/global-modal";

const GlobalModal: React.FC = () => {
  const { isOpen, message, onConfirm, closeModal } = useGlobalModal();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    closeModal();
    if (onConfirm) {
      onConfirm();
    } else {
      navigate("/authentication/login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm mx-4 text-center animate-fade-in">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">{message}</h2>
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium shadow"
          onClick={handleConfirm}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default GlobalModal; 