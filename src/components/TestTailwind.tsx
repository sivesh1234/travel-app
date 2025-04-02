import React from 'react';

const TestTailwind: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md m-4">
      <h2 className="text-xl font-bold">Tailwind CSS Test</h2>
      <p className="mt-2">If this text is styled with Tailwind CSS, everything is working correctly!</p>
    </div>
  );
};

export default TestTailwind; 