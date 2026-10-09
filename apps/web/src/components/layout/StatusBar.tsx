import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-civic-text select-none z-30">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular Signal bars */}
        <div className="flex items-end gap-0.5 h-2.5">
          <div className="w-0.5 h-1 bg-civic-text rounded-sm" />
          <div className="w-0.5 h-1.5 bg-civic-text rounded-sm" />
          <div className="w-0.5 h-2 bg-civic-text rounded-sm" />
          <div className="w-0.5 h-2.5 bg-civic-text rounded-sm" />
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <Battery className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
}
