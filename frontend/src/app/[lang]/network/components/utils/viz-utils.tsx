import * as d3 from "d3";
import { Link } from '../types';
export const color = d3
  .scaleOrdinal()
  .domain([1, 2, 3, 4])
  .range(["#000", "#27ae60", "#fdd835", "#43a047"]);

export const calcDistance = ({ distance, width }) => {
  if (distance === "responsive") {
    switch (true) {
      case width < 450:
        return -400;
        break;
      case width >= 450:
        return 100;
        break;
    }
  } else {
    return distance;
  }
};

export const getHierarchFill = ({
  cat,
  direction,
  highlightNodeColor,
  therapyNodeColorCircle,
  grayNodecolor,
  gaming
}) => {
  if(gaming) return gamingNodeColor
  if (direction == "incoming") {
    switch (cat) {
      case "direct": // ... -> X -> ...
        return therapyNodeColorCircle;
      case "indirect":
        return "#2980b9"; // ... -> ... -> X
      case "target": // X -> ... -> ...
        return grayNodecolor;
    }
  } else {
    switch (cat) {
      case "direct":
        return therapyNodeColorCircle;
      case "indirect":
        return grayNodecolor;
      case "target":
        return "#2980b9";
    }
  }
};

export const setLinkOpacity = ({
  d,
  linkFilter,
  highlightNode,
  responseDirection,
  feedback,
  links,
  noLinkHighlight,
  hierachyFeedback,
  positive = false
}) => {
  if (d.size >= linkFilter || positive) {
    if (noLinkHighlight || hierachyFeedback) return lineOpacity(d.size);
    if (feedback) {
      const targetId = highlightNode[0];
      const gamingOutgoing = links
        .filter((d) => d.source.id == targetId && d.display)
        .map((d) => d.source.id);

      return highlightNode.length == 0 ||
        highlightNode.includes(
          responseDirection == "incoming" ? d.source.id : d.target.id
        ) ||
        gamingOutgoing.includes(d.source.id)
        ? lineOpacity(d.size)
        : 0.01;
    } else {
      let isHighlighted = highlightNode.length == 0 ||
        highlightNode.includes(
          responseDirection == "incoming" ? d.target.id : d.source.id
        )
        if(positive) {
          isHighlighted = isHighlighted || (d.target.id === highlightNode[0] && d.source.nodeId === "gaming")
        }
      return isHighlighted
        ? lineOpacity(d.size)
        : 0.01;
    }
  } else {
    return 0;
  }
};

export const lineOpacity = d3
  .scalePow()
  .domain([0, 100])
  .range([0, 1])
  .exponent(2);

export const nodeOpacity = d3.scaleLinear().domain([0, 100]).range([0.1, 1]);

export const setNodeOpacity = ({
  d,
  data,
  feedback,
  highlightNode,
  linkFilter,
  responseDirection,
}) => {
  if (d.size >= linkFilter) {
    if (feedback) {
      const targetId = highlightNode[0];
      // TODO: no need to this for every value of d?
      const gamingOutgoing = data.links
        .filter((d) => d.source.id == targetId && d.display)
        .map((d) => d.source.id);
      return highlightNode.length == 0 ||
        highlightNode.includes(d.target.id) ||
        gamingOutgoing.includes(d.source.id)
        ? lineOpacity(d.size)
        : 0.01;
    } else {
      return highlightNode.length == 0 ||
        highlightNode.includes(
          responseDirection == "incoming" ? d.target.id : d.source.id
        )
        ? lineOpacity(d.size)
        : 0.01;
    }
  } else return 0;
};

export const drag = (simulation) => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};
export function reLinkToEdge({
  pathEl,
  d,
  size,
  markerSize,
  hierachyFeedback,
}) {
  if (!pathEl || !d.source || !d.target) return "";
  // length of current path
  const pathLength = pathEl.getTotalLength();
  // radius of target and markerhead
  const offset = size(d.target.size) + markerSize + 5;
  const m = pathEl.getPointAtLength(pathLength - offset);
  const dx = m.x - d.source.x;
  const dy = m.y - d.source.y;
  const dr = Math.sqrt(dx * dx + dy * dy);
  if (hierachyFeedback) return `M${d.source.x},${d.source.y} L${m.x},${m.y}`;
  return `M${d.source.x - 20},${d.source.y}A${dr},${dr} 0 0,1 ${m.x - 20},${m.y}`;
}

export function linkArc(d, hierachyFeedback) {
  if (hierachyFeedback)
    return `M ${d.source.x},${d.source.y}L ${d.target.x},${d.target.y}`;

  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  const dr = Math.sqrt(dx * dx + dy * dy);
  return `M ${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
}

export const linkStrength = d3
  .scalePow()
  .domain([0, 100])
  .range([0, 0.05])
  .exponent(3);

export const calcNodeXPosition = (d, width) => {
  if (typeof d.xPosCat !== "undefined") {
    if (width > 450) {
      switch (d.xPosCat) {
        case "target":
          return -width / 4;
          break;
        case "direct":
          return 0;
          break;
        case "indirect":
          return width / 4;
          break;
      }
    } else {
      switch (d.xPosCat) {
        case "target":
          return -width / 3;
          break;
        case "direct":
          return 0;
          break;
        case "indirect":
          return width / 3;
          break;
      }
    }
  } else return 0;
};
export const calcNodeYPosition = ({
  d,
  width,
  targetNodeCount,
  directNodeCount,
  indirectNodeCount,
}) => {
  if (typeof d.xPosCat !== "undefined") {
    switch (d.xPosCat) {
      case "target":
        return (
          (d.xPosCatIndex - (targetNodeCount - 1) / 2) *
          Math.sqrt(width) *
          2 *
          2
        );
        break;
      case "direct":
        return (
          (d.xPosCatIndex - (directNodeCount - 1) / 2) *
          Math.sqrt(width) *
          2 *
          2
        );
        break;
      case "indirect":
        return (
          (d.xPosCatIndex - (indirectNodeCount - 1) / 2) *
          Math.sqrt(width) *
          2 *
          2
        );
        break;
    }
  } else return 0;
};

export const reAddNodes = (links, nodes) => {
  return links
    .map((m) => {
      const newTarget = nodes.filter((f) => f.id == m.target.id)[0];
      const newSource = nodes.filter((f) => f.id == m.source.id)[0];
      // TODO: this avoids breaking the app, but links are still shown
      if (
        typeof newSource !== "undefined" &&
        typeof newTarget !== "undefined"
      ) {
        m.source = newSource;
        m.target = newTarget;
        return m;
      } else {
        return m;
      }
    })
    .filter((d) => d);
};

export const getLinkClass = ({d, highlightNode, links, feedback, hierachyFeedback, noLinkHighlight, responseDirection, positive = false}) => {

  if (hierachyFeedback) return "linkHighlight";
  if (noLinkHighlight) return null;
  if (feedback) {
    const targetId = highlightNode[0];
    // TODO: no need to this for every value of d?
    const gamingOutgoing = links
      .filter((d) => d.source.id == targetId && d.display)
      .map((d) => d.source.id);
    return highlightNode.includes(d.target.id) ||
      gamingOutgoing.includes(d.source.id)
      ? "linkHighlight"
      : null;
  } else {
    const isHighlighted = highlightNode.includes(
      responseDirection == "incoming" ? d.target.id : d.source.id
    ) 
    return isHighlighted
      ? "linkHighlight"
      : null;
  }
}

const gamingNodeColor = "#2c3e50"
export const getNodeFill = ({d, highlightNode, links, hierachyFeedback, responseDirection}) => {
  {
    if (hierachyFeedback)
      return getHierarchFill({
        cat: d.xPosCat,
        direction: hierachyFeedback,
        highlightNodeColor: "#e74c3c",
        therapyNodeColorCircle: "#e74c3c",
        grayNodecolor: "#C0C0C0",
        gaming: d.nodeId === "gaming"
      });
    const sources = links
      .filter((link: Link) =>
        highlightNode.includes(
          responseDirection === "incoming" ? link.target.id : link.source.id
        )
      )
      .map((node: Link) =>
        responseDirection === "incoming" ? node.source.id : node.target.id
      );
    if (highlightNode.length === 0)
      return d?.type === "positive"
        ? "green"
        : d.nodeId !== "gaming"
        ? "#e74c3c"
        : gamingNodeColor;
    if (highlightNode.includes(d.id) && d.nodeId !== "gaming") return "#e74c3c";
    if (sources.includes(d.id) && d.nodeId !== "gaming") return "#e74c3c";
    if (highlightNode.includes(d.id) && d.nodeId === "gaming") return gamingNodeColor;
    if (sources.includes(d.id) && d.nodeId === "gaming") return gamingNodeColor;
    else return "#C0C0C0";
  }
}