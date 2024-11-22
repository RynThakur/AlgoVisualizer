import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Plus } from 'lucide-react';
import { bubbleSort, mergeSort, binaryInsertionSort, selectionSort } from '/Users/aryanthakur/Desktop/project/src/components/Sorting/Algorithms.ts';

const algorithms = ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'];

interface SortingProps {
  darkMode: boolean;
}

function Sorting({ darkMode }: SortingProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 50) + 1
    );
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addNumber = () => {
    const number = parseInt(inputValue);
    if (!isNaN(number) && number > 0 && number <= 50) {
      setArray([...array, number]);
      setInputValue('');
    }
  };

  const clearArray = () => {
    setArray([]);
    setComparing([]);
    setSwapping([]);
  };

  const visualize = async () => {
    if (array.length < 2) return;
    setIsAnimating(true);

    try {
      switch (selectedAlgorithm) {
        case 'Bubble Sort':
          await bubbleSort(array, setArray, setComparing, setSwapping);
          break;
        case 'Merge Sort':
          await mergeSort(array, setArray, setComparing, setSwapping);
          break;
        case 'Binary Insertion Sort':
          await binaryInsertionSort(array, setArray, setComparing, setSwapping);
          break;
        case 'Selection Sort':
          await selectionSort(array, setArray, setComparing, setSwapping);
          break;
      }
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div
      className={`space-y-6 p-8 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isAnimating}
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
            disabled={isAnimating || array.length < 2}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
              darkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600'
                : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300'
            } text-white`}
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
                : 'bg-white hover:bg-gray-100 disabled:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Random Array</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            max="50"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a number (1-50)"
            disabled={isAnimating || array.length >= 20}
            className={`rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-gray-700 text-white focus:ring-indigo-500'
                : 'bg-white text-gray-900 focus:ring-indigo-300'
            }`}
          />
          <button
            onClick={addNumber}
            disabled={isAnimating || array.length >= 20 || !inputValue}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600'
                : 'bg-green-500 hover:bg-green-600 disabled:bg-gray-300'
            } text-white`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Number</span>
          </button>
          <button
            onClick={clearArray}
            disabled={isAnimating || array.length === 0}
            className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
              darkMode
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600'
                : 'bg-red-500 hover:bg-red-600 disabled:bg-gray-300'
            } text-white`}
          >
            Clear Array
          </button>
        </div>
      </div>

      <div
        className={`h-[400px] rounded-lg p-8 flex items-end justify-center space-x-2 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={`w-8 rounded-t-lg ${
              swapping.includes(index)
                ? 'bg-green-500'
                : comparing.includes(index)
                ? 'bg-yellow-500'
                : darkMode
                ? 'bg-indigo-500'
                : 'bg-indigo-400'
            }`}
            style={{ height: `${value * 2}%` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {array.length === 0 ? (
          <p>Add numbers to begin visualization (max 20 numbers)</p>
        ) : (
          <p>Current array: [{array.join(', ')}]</p>
        )}
      </div>
    </div>
  );
}

export default Sorting;