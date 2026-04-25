import React from 'react';
import { Briefcase } from 'lucide-react';

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-5">
        {/* Logo + Spinner combo */}
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center
                          shadow-lg shadow-blue-500/30">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -inset-1.5 rounded-2xl border-2 border-blue-500/30
                          border-t-blue-500 animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-lg font-bold text-white tracking-tight">FastHire</p>
          <p className="text-sm text-gray-400 mt-0.5">Finding the right opportunity for you...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
