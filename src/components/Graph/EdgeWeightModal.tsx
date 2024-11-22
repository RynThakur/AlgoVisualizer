import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface EdgeWeightModalProps {
  darkMode: boolean;
  onSubmit: (weight: number) => void;
  onClose: () => void;
  fromNode: number;
  toNode: number;
}

export function EdgeWeightModal({
  darkMode,
  onSubmit,
  onClose,
  fromNode,
  toNode,
}: EdgeWeightModalProps) {
  const [weight, setWeight] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const parsedWeight = parseInt(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Please enter a positive number');
      return;
    }
    onSubmit(parsedWeight);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Enter Edge Weight</h3>
        <p className="text-sm mb-4 opacity-75">
          Enter the weight for the edge between nodes {fromNode} and {toNode}
        </p>
        
        <input
          type="number"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setError('');
          }}
          min="1"
          className={`w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 text-white focus:ring-indigo-500'
              : 'bg-gray-100 text-gray-900 focus:ring-indigo-300'
          }`}
        />
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-lg ${
            darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-500 hover:bg-indigo-600'
          } text-white transition-colors`}
        >
          Create Edge
        </button>
      </motion.div>
    </motion.div>
  );
}