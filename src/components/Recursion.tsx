import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const fibCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

interface CallStackFrame {
  n: number;
  depth: number;
  result?: number;
}

interface RecursionProps {
  darkMode: boolean;
}

function Recursion({ darkMode }: RecursionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [input, setInput] = useState(5);

  const visualize = async () => {
    setIsAnimating(true);
    setCallStack([]);
    setCurrentLine(0);

    const animate = async (n: number, depth: number): Promise<number> => {
      setCallStack((prev) => [...prev, { n, depth }]);
      setCurrentLine(1);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (n <= 1) {
        setCurrentLine(2);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCallStack((prev) =>
          prev.map((frame) =>
            frame.n === n && frame.depth === depth
              ? { ...frame, result: n }
              : frame
          )
        );
        return n;
      }

      setCurrentLine(3);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const n1 = await animate(n - 1, depth + 1);
      const n2 = await animate(n - 2, depth + 1);
      const result = n1 + n2;

      setCallStack((prev) =>
        prev.map((frame) =>
          frame.n === n && frame.depth === depth
            ? { ...frame, result }
            : frame
        )
      );

      return result;
    };

    await animate(input, 0);
    setIsAnimating(false);
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-r from-blue-50 via-white to-blue-50'
      }`}
    >
      <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Input and Code Panel */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(Number(e.target.value))}
              min="0"
              max="10"
              className={`rounded-lg px-4 py-2 w-24 text-center shadow focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-gray-700 text-white focus:ring-indigo-500'
                  : 'bg-gray-200 text-gray-900 focus:ring-indigo-400'
              }`}
            />
            <button
              onClick={visualize}
              disabled={isAnimating}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg shadow-lg transition-all duration-300 ${
                isAnimating
                  ? 'cursor-not-allowed'
                  : 'transform hover:scale-105 hover:shadow-xl'
              } ${
                darkMode
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-gray-300'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Visualize</span>
            </button>
          </div>

          <div
            className={`rounded-lg p-4 font-mono text-sm leading-6 shadow transition-colors ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
            }`}
          >
            <SyntaxHighlighter
              language="javascript"
              style={darkMode ? tomorrow : coy}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber:number) => ({
                style: currentLine === lineNumber - 1
                  ? {
                      backgroundColor: darkMode
                        ? 'rgba(56, 189, 248, 0.2)'
                        : 'rgba(99, 102, 241, 0.1)',
                      display: 'block',
                    }
                  : {},
              })}
            >
              {fibCode}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Call Stack Panel */}
        <div
          className={`rounded-lg p-6 shadow-xl overflow-y-auto max-h-[600px] transition-colors ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Call Stack
          </h3>
          <div className="space-y-4">
            {callStack.map((frame, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-lg p-3 shadow transition-all ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                style={{ marginLeft: `${frame.depth * 20}px` }}
              >
                <div className="font-mono text-sm">
                  fibonacci({frame.n})
                  {frame.result !== undefined && ` = ${frame.result}`}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recursion;
