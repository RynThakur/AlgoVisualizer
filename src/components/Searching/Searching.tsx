import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Search, X, AlertCircle } from 'lucide-react';

interface SearchingProps {
  darkMode: boolean;
}

function Searching({ darkMode }: SearchingProps) {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [searchType, setSearchType] = useState<'linear' | 'binary'>('linear');
  const [showModal, setShowModal] = useState(false);
  const [arrayInput, setArrayInput] = useState('');
  const [error, setError] = useState('');

  const generateArray = () => {
    const newArray = Array.from({ length: 15 }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setError('');
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const linearSearch = async () => {
    setIsAnimating(true);
    setFoundIndex(null);

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await sleep(500);

      if (array[i] === target) {
        setFoundIndex(i);
        setCurrentIndex(null);
        setIsAnimating(false);
        return;
      }
    }

    setCurrentIndex(null);
    setIsAnimating(false);
  };

  const binarySearch = async () => {
    if (!isArraySorted(array)) {
      setError('Array must be sorted for binary search');
      return;
    }

    setIsAnimating(true);
    setFoundIndex(null);
    setError('');

    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      await sleep(500);

      if (array[mid] === target) {
        setFoundIndex(mid);
        setCurrentIndex(null);
        setIsAnimating(false);
        return;
      }

      if (array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setCurrentIndex(null);
    setIsAnimating(false);
  };

  const handleSearch = () => {
    if (searchType === 'linear') {
      linearSearch();
    } else {
      binarySearch();
    }
  };

  const isArraySorted = (arr: number[]) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  const handleArraySubmit = () => {
    try {
      const newArray = arrayInput
        .split(',')
        .map((num) => {
          const parsed = parseInt(num.trim());
          if (isNaN(parsed)) throw new Error('Invalid number');
          return parsed;
        });

      if (newArray.length === 0) throw new Error('Array cannot be empty');
      if (newArray.length > 20) throw new Error('Array too large (max 20 elements)');

      setArray(searchType === 'binary' ? [...newArray].sort((a, b) => a - b) : newArray);
      setTarget(newArray[0]);
      setShowModal(false);
      setArrayInput('');
      resetSearch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  return (
    <div
      className={`space-y-6 p-8 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'linear' | 'binary')}
          disabled={isAnimating}
          className={`rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 text-white focus:ring-indigo-500'
              : 'bg-white text-gray-900 focus:ring-indigo-300'
          }`}
        >
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
        </select>

        <div className="flex items-center gap-2">
          <span>Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isAnimating}
            className={`w-20 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-gray-700 text-white focus:ring-indigo-500'
                : 'bg-white text-gray-900 focus:ring-indigo-300'
            }`}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isAnimating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
            darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600'
              : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300'
          } text-white`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setShowModal(true)}
          disabled={isAnimating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
            darkMode
              ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600'
              : 'bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300'
          } text-white`}
        >
          <Play className="w-4 h-4" />
          <span>Input Array</span>
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

      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div
        className={`min-h-[200px] rounded-lg p-8 grid grid-cols-5 gap-4 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={`aspect-square rounded-lg flex items-center justify-center text-lg font-medium shadow-md ${
              index === foundIndex
                ? 'bg-green-500 text-white'
                : index === currentIndex
                ? 'bg-yellow-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {value}
          </motion.div>
        ))}
      </div>

      <div className="text-sm space-y-1 opacity-75">
        <p>• Array is {searchType === 'binary' ? 'automatically sorted' : 'kept in input order'} for {searchType} search</p>
        <p>• Yellow indicates current search position</p>
        <p>• Green indicates found target</p>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
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
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-semibold mb-4">Enter Array Values</h3>
              <p className="text-sm mb-4 opacity-75">
                Enter numbers separated by commas (e.g., 1, 5, 3, 8, 2)
              </p>
              
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="e.g., 1, 5, 3, 8, 2"
                className={`w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'bg-gray-700 text-white focus:ring-indigo-500'
                    : 'bg-gray-100 text-gray-900 focus:ring-indigo-300'
                }`}
              />
              
              <button
                onClick={handleArraySubmit}
                className={`w-full py-2 rounded-lg ${
                  darkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                } text-white transition-colors`}
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Searching;