import React, { createContext, useState, useContext, ReactNode } from "react";

interface ScrollPositionContextType {
  saveScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
}

const ScrollPositionContext = createContext<
  ScrollPositionContextType | undefined
>(undefined);

interface ScrollPositionProviderProps {
  children: ReactNode;
}

export const ScrollPositionProvider: React.FC<ScrollPositionProviderProps> = ({
  children,
}) => {
  const [positions, setPositions] = useState<{ [key: string]: number }>({});

  const saveScrollPosition = (key: string, position: number) => {
    setPositions((prev) => ({ ...prev, [key]: position }));
  };

  const getScrollPosition = (key: string): number => {
    return positions[key] || 0;
  };

  return (
    <ScrollPositionContext.Provider
      value={{ saveScrollPosition, getScrollPosition }}
    >
      {children}
    </ScrollPositionContext.Provider>
  );
};

export const useScrollPosition = (): ScrollPositionContextType => {
  const context = useContext(ScrollPositionContext);
  if (!context) {
    throw new Error(
      "useScrollPosition must be used within a ScrollPositionProvider"
    );
  }
  return context;
};
