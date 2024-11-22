import React from 'react';
import { Node, Edge } from './Types';

interface GraphEdgeProps {
  edge: Edge;
  nodes: Node[];
  darkMode: boolean;
}

export function GraphEdge({ edge, nodes, darkMode }: GraphEdgeProps) {
  const fromNode = nodes[edge.from];
  const toNode = nodes[edge.to];

  if (!fromNode || !toNode) return null;

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);
  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;

  return (
    <>
      <div
        className="absolute h-0.5 origin-left"
        style={{
          left: `${fromNode.x}px`,
          top: `${fromNode.y}px`,
          width: `${length}px`,
          transform: `rotate(${angle}deg)`,
          backgroundColor: darkMode ? 'white' : 'black',
        }}
      />
      <div
        className={`absolute px-2 py-1 rounded text-sm -translate-x-1/2 -translate-y-1/2 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
        style={{
          left: `${midX}px`,
          top: `${midY}px`,
        }}
      >
        {edge.weight}
      </div>
    </>
  );
}