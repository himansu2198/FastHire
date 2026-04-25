import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-200 group cursor-default">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors duration-200 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 text-base">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;