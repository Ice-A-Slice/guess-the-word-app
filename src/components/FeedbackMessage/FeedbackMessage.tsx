import React from 'react';

export type MessageType = 'success' | 'error' | 'info';

export interface FeedbackMessageProps {
  message: string;
  type: MessageType;
  id?: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  message,
  type,
  id
}) => {
  const messageId = id || `feedback-message-${type}`;
  
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

  const getIcon = (): React.ReactNode => {
    switch (type) {
      case 'success':
        return <span aria-hidden="true">✓</span>;
      case 'error':
        return <span aria-hidden="true">✗</span>;
      case 'info':
      default:
        return <span aria-hidden="true">ℹ</span>;
    }
  };

  const roleType = type === 'error' ? 'alert' : 'status';
  
  return (
    <div 
      className={`border p-4 rounded-md my-4 ${getTypeStyles()}`}
      role={roleType}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      id={messageId}
      tabIndex={0}
      aria-atomic="true"
      data-testid={`feedback-${type}`}
    >
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-2">{message}</span>
      </div>
    </div>
  );
}; 