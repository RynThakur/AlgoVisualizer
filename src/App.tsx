import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, GitGraph, SortDesc, Sun, Moon, Search } from 'lucide-react';
import PathFinder from '/Users/aryanthakur/Desktop/project/src/components/PathFinder.tsx';
import Sorting from '/Users/aryanthakur/Desktop/project/src/components/Sorting/Sorting.tsx';
import Recursion from '/Users/aryanthakur/Desktop/project/src/components/Recursion.tsx';
import Searching from  '/Users/aryanthakur/Desktop/project/src/components/Searching/Searching.tsx'

const tabs = [
  { id: 'pathfinder', name: 'Path Finder', icon: GitGraph },
  { id: 'sorting', name: 'Sorting', icon: SortDesc },
  { id: 'recursion', name: 'Recursion', icon: Code2 },
  { id: 'searching', name: 'Searching', icon: Search },
];

function App() {
  const [activeTab, setActiveTab] = useState('pathfinder');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <nav
        className={`border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-700' : 'border-gray-300'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Algorithm Visualizer</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex sm:space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? `border-indigo-500 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`
                          : `border-transparent ${
                              darkMode
                                ? 'text-gray-300 hover:text-gray-100'
                                : 'text-gray-700 hover:text-gray-900'
                            }`
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'pathfinder' && <PathFinder darkMode={darkMode} />}
          {activeTab === 'sorting' && <Sorting darkMode={darkMode} />}
          {activeTab === 'recursion' && <Recursion darkMode={darkMode} />}
          {activeTab === 'searching' && <Searching darkMode={darkMode} />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;