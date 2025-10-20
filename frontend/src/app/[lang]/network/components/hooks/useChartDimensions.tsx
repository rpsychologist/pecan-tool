import { useEffect, useRef, useState } from "react";

const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 10,
    marginRight: dimensions.marginRight || 10,
    marginBottom: dimensions.marginBottom || 10,
    marginLeft: dimensions.marginLeft || 10,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
      parsedDimensions.marginTop -
      parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
      parsedDimensions.marginLeft -
      parsedDimensions.marginRight,
      0
    ),
  };
};

const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);
  const [width, setWidth] = useState(0);
  const [fixed, setFixed] = useState(false)
  const [height, setHeight] = useState(0);
  const prevWidth = useRef(0);
  const handleSetWidth = (newWidth) => {
    if(fixed) return

    setWidth(newWidth)
  }
  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions];
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];
      if (width != entry.contentRect.width) handleSetWidth(entry.contentRect.width);
      if (height != entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [fixed]);
  useEffect(() => {
    const handleBeforePrint = () => {
      if (ref.current) {
        prevWidth.current = width
        setFixed(true)
        setWidth(900); // fixed print width here
      }
    };

    const handleAfterPrint = () => {
      if (ref.current) {
        setFixed(false)

        setWidth(prevWidth.current); // Reset to dynamic width 
      }
    };

    // event listeners for print dialog
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [width]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

export default useChartDimensions;