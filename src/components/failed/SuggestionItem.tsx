import React from 'react';
import '../../../style/SuggestionItem.css';

export interface MyProps {
  type: 'info' | 'warn' | 'error';
  text: string;
}

export default function SuggestionItem({ type, text }: MyProps) {
  return (
    <div className={`jp-SparkConnectExtension-SuggestionItem-root ${type}`}>
      <span className="material-symbols-outlined">
        {type === 'info' && 'info'}
        {type === 'error' && 'error'}
        {type === 'warn' && 'warning'}
      </span>
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  );
}
