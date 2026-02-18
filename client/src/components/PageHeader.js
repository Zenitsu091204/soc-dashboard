import * as React from 'react';

export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-400 mt-1 text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {right && (
        <div className="ml-auto">
          {right}
        </div>
      )}
    </div>
  );
}
