import { useState, useEffect } from 'react';

// without scroll bars
const useWindowSize = (client) => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: document.documentElement.clientWidth, 
          height: document.documentElement.clientHeight 
        });
      };

      // Initialize size on component mount
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [client]); 

  return windowSize;
};

export default useWindowSize;
