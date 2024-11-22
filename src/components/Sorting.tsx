import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw } from 'lucide-react';

const algorithms = [
  'Bubble Sort',
  'Merge Sort',
  'Binary Insertion Sort',
  'Selection Sort',
];

interface SortingProps {
  darkMode: boolean;
}

function Sorting({ darkMode }: SortingProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 50) + 1
    );
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await sleep(100);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          await sleep(100);

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(100);
        }

        setSwapping([]);
      }
    }

    setComparing([]);
  };

  const visualize = async () => {
    setIsAnimating(true);

    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        await bubbleSort();
        break;
      // Add other algorithms here
    }

    setIsAnimating(false);
  };

  return (
    <div
      className={`space-y-6 p-8 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="flex items-center space-x-6">
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className={`rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 text-white focus:ring-indigo-500'
              : 'bg-white text-gray-900 focus:ring-indigo-300'
          }`}
        >
          {algorithms.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
        <button
          onClick={visualize}
          disabled={isAnimating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
            darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600'
              : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Visualize</span>
        </button>
        <button
          onClick={generateArray}
          disabled={isAnimating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600'
              : 'bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Array</span>
        </button>
      </div>

      <div
        className={`h-[400px] rounded-lg p-8 flex items-end justify-center space-x-2 shadow-lg ${
          darkMode ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={`w-8 rounded-t-lg ${
              swapping.includes(index)
                ? darkMode
                  ? 'bg-gradient-to-t from-green-400 to-green-600'
                  : 'bg-gradient-to-t from-green-200 to-green-400'
                : comparing.includes(index)
                ? darkMode
                  ? 'bg-gradient-to-t from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-t from-yellow-200 to-yellow-400'
                : darkMode
                ? 'bg-gradient-to-t from-gray-400 to-gray-600'
                : 'bg-gradient-to-t from-gray-300 to-gray-500'
            }`}
            style={{ height: `${value * 2}%` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}

export default Sorting;
