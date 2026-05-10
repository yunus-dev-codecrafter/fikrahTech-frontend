import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center p-10 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-blue-600">UI RESET SUCCESSFUL</h1>
        <p className="text-slate-600 mt-2">The system is now stable and clean.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Verify Stability
        </button>
      </div>
    </div>
  );
}

export default App;