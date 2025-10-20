import React, { useRef, useEffect, useState } from "react";
import useResizeObserver from "./hooks/useResiveObserver"

const responsiveChart = props => {
    const ref = useRef();



    const { width, height } = useResizeObserver({ ref });

    const Chart = props.chart;

    return (
        <div ref={ref} className="h-full w-full">
            {width > 1 && <Chart {...props} width={width} height={height} />}
        </div>
    );
};

export default responsiveChart;