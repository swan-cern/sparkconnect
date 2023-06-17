import React from 'react';

export interface MyProps {
  type: 'info' | 'warn' | 'error';
  text: string;
}

export default function SuggestionItem({ type, text }: MyProps) {
  const color = {
    info: 'var(--jp-info-color1)',
    warn: 'var(--jp-warn-color1)',
    error: 'var(--jp-error-color1)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, color: color[type] }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
        {type === 'info' && 'info'}
        {type === 'error' && 'error'}
        {type === 'warn' && 'warning'}
      </span>
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  );
}
