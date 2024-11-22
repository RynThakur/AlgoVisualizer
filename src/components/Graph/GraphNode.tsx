import React from 'react';
import { Node } from './Types';
import { Trash2 } from 'lucide-react';

interface GraphNodeProps {
  node: Node;
  index: number;
  isStart: boolean;
  isEnd: boolean;
  darkMode: boolean;
  onClick: (index: number, e: React.MouseEvent) => void;
  onRightClick: (index: number, e: React.MouseEvent) => void;
  onDoubleClick: (index: number, e: React.MouseEvent) => void;
  onDelete: (index: number) => void;
}

export function GraphNode({
  node,
  index,
  isStart,
  isEnd,
  darkMode,
  onClick,
  onRightClick,
  onDoubleClick,
  onDelete,
}: GraphNodeProps) {
  const [showDelete, setShowDelete] = React.useState(false);

  const getNodeColor = () => {
    if (isStart) return 'bg-green-500';
    if (isEnd) return 'bg-red-500';
    if (node.isPath) return 'bg-yellow-400';
    if (node.visited) return 'bg-indigo-500';
    return darkMode ? 'bg-gray-600' : 'bg-gray-300';
  };

  return (
    <div
      className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-colors duration-300 ${getNodeColor()}`}
      style={{ left: node.x, top: node.y }}
      onClick={(e) => onClick(index, e)}
      onContextMenu={(e) => onRightClick(index, e)}
      onDoubleClick={(e) => onDoubleClick(index, e)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-center justify-center h-full text-white font-medium">
        {index}
      </div>
      {showDelete && !isStart && !isEnd && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}