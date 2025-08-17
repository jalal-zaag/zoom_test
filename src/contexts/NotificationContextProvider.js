import React, { createContext } from 'react';

// Minimal NotificationContext with default values
export const NotificationContext = createContext({
  meetingStart: () => {},
  isMeetingStart: false,
  dataId: null,
});

export const NotificationContextProvider = ({ children }) => {
  // You can expand this with real logic as needed
  const contextValue = {
    meetingStart: () => {},
    isMeetingStart: false,
    dataId: null,
  };
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

