import React from 'react';
import { Algorithm } from './Types';
import { Play, RotateCcw } from 'lucide-react';

interface ControlsProps {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onVisualize: () => void;
  onReset: () => void;
  isAnimating: boolean;
  hasValidPath: boolean;
  darkMode: boolean;
}

export function Controls({
  selectedAlgorithm,
  onAlgorithmChange,
  onVisualize,
  onReset,
  isAnimating,
  hasValidPath,
  darkMode,
}: ControlsProps) {
  const algorithms: Algorithm[] = ['Dijkstra', 'BFS', 'DFS', 'A*'];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={selectedAlgorithm}
        onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
        disabled={isAnimating}
        className={`px-4 py-2 rounded-lg border ${
          darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        {algorithms.map((algorithm) => (
          <option key={algorithm} value={algorithm}>
            {algorithm}
          </option>
        ))}
      </select>

      <button
        onClick={onVisualize}
        disabled={isAnimating || !hasValidPath}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isAnimating || !hasValidPath
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-indigo-600'
        } bg-indigo-500 text-white transition-colors duration-200`}
      >
        <Play size={18} />
        Visualize
      </button>

      <button
        onClick={onReset}
        disabled={isAnimating}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isAnimating
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-200'
        } ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
        } transition-colors duration-200`}
      >
        <RotateCcw size={18} />
        Reset
      </button>
    </div>
  );
}