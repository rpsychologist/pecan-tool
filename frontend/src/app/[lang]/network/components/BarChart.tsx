import { useEffect, useRef } from "react";
import * as d3 from "d3";
import useChartDimensions from "./hooks/useChartDimensions";

const marginTop = 10;
const marginBottom = 10;
//const marginLeft = 0;
const marginRight = 25;

const BarChart = ({ data, heading = true }) => {
    const [ref, dms] = useChartDimensions({
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 10
    });
    const width = dms.width;
    const height = dms.height;
    const marginLeft = width < 450 ? width / 2 : width / 3
    const refYAxis = useRef()
    const chartBottomY = height - marginBottom;

    // Create the horizontal scale and its axis generator.
    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.sum)])
        .range([marginLeft, width - marginRight])
        .nice();

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    // Create the vertical scale and its axis generator.
    const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .padding(0.2)
        .range([marginTop, chartBottomY]);

    const yAxis = d3.axisLeft(yScale);

    useEffect(() => {
        // d3.select(".x-axis")
        //     .call(xAxis)
        //     .selectAll("text")
        //     .attr("class", "hidden")
        //     // Rotate the labels to make them easier to read.
        //     .attr("transform", "rotate(-45)")
        //     .attr("text-anchor", "end");

        d3.select(refYAxis.current)
            .call(yAxis)
            .selectAll("text")
            .attr("class", "sm:text-sm md:text-lg");
    }, [xAxis, yAxis]);

    return (
        <div className="container mx-auto" style={{ height: data.length * (Math.sqrt(width)) * 1.2 }}>
            <div
                ref={ref}
                style={{
                    height: "100%",
                    width: "100%"
                }}
            >
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    className="mx-auto"
                >
                    <g className="bars">
                        {data.map((d, i) => (
                            <rect
                                key={i}
                                x={xScale(0)}
                                y={yScale(d.label)}
                                width={xScale(d.sum) - xScale(0)}
                                height={yScale.bandwidth()}
                                className={"fill-blue-500 rounded-md"}
                            />
                        ))}
                    </g>
                    <g className="y-axis" ref={refYAxis} transform={`translate(${marginLeft},0)`}></g>
                </svg>
            </div>
        </div>

    );
};

export default BarChart;