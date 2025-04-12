import React from 'react';

export type MessageType = 'success' | 'error' | 'info';

export interface FeedbackMessageProps {
  message: string;
  type: MessageType;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  message,
  type
}) => {
  const getTypeStyles = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  const getIcon = (): string => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const roleType = type === 'error' ? 'alert' : 'status';
  
  return (
    <div 
      className={`border p-4 rounded-md my-4 ${getTypeStyles()}`}
      role={roleType}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-center">
        <span className="mr-2" aria-hidden="true">{getIcon()}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}; 