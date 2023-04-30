import React from 'react';

type Props = {
  label: string;
  onNavigate: (action: 'PREV' | 'TODAY' | 'NEXT') => void;
};

export const CustomToolbar = ({ label, onNavigate }: Props) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>
          戻る
        </button>
        <button type="button" onClick={() => onNavigate('TODAY')}>
          今日
        </button>
        <button type="button" onClick={() => onNavigate('NEXT')}>
          次へ
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
    </div>
  );
};
