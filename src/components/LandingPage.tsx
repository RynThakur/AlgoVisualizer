import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/main');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-indigo-600 text-white">
      <motion.h1
        className="text-5xl font-bold mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Algorithm Visualizer
      </motion.h1>
      <motion.p
        className="text-lg mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Explore Pathfinding, Sorting, and Recursion Visualizations
      </motion.p>
      <motion.button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Get Started
      </motion.button>
    </div>
  );
};

export default LandingPage;
