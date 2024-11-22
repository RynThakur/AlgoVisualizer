import React, { useState, useRef, useCallback } from 'react';
import { Controls } from '/Users/aryanthakur/Desktop/project/src/components/Graph/Controls.tsx';
import { GraphNode } from '/Users/aryanthakur/Desktop/project/src/components/Graph//GraphNode';
import { GraphEdge } from '/Users/aryanthakur/Desktop/project/src/components/Graph/GraphEdge';
import { Dijkstra, Bfs, Dfs, Astar } from '/Users/aryanthakur/Desktop/project/src/components/Graph//Algorithms';
import { Node, Edge, Algorithm } from '/Users/aryanthakur/Desktop/project/src/components/Graph/Types';

interface PathFinderProps {
  darkMode: boolean;
}

function PathFinder({ darkMode }: PathFinderProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('Dijkstra');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [edgeStartNode, setEdgeStartNode] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current || isAnimating || edgeStartNode !== null) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        x,
        y,
        id: prevNodes.length,
        visited: false,
        distance: Infinity,
        isPath: false,
      },
    ]);
  }, [isAnimating, edgeStartNode]);

  const handleNodeClick = useCallback((nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating) return;
    
    if (edgeStartNode !== null) {
      if (edgeStartNode !== nodeId) {
        const distance = calculateDistance(
          nodes[edgeStartNode],
          nodes[nodeId]
        );
        
        setEdges((prevEdges) => [
          ...prevEdges,
          {
            from: edgeStartNode,
            to: nodeId,
            weight: Math.round(distance / 50),
          },
        ]);
      }
      setEdgeStartNode(null);
    }
  }, [isAnimating, edgeStartNode, nodes]);

  const handleNodeDelete = useCallback((nodeId: number) => {
    if (isAnimating) return;

    setNodes((prevNodes) => {
      const newNodes = prevNodes.filter((_, index) => index !== nodeId);
      return newNodes.map((node, index) => ({ ...node, id: index }));
    });

    setEdges((prevEdges) => {
      const filteredEdges = prevEdges.filter(
        edge => edge.from !== nodeId && edge.to !== nodeId
      );
      
      return filteredEdges.map(edge => ({
        ...edge,
        from: edge.from > nodeId ? edge.from - 1 : edge.from,
        to: edge.to > nodeId ? edge.to - 1 : edge.to,
      }));
    });

    if (startNode === nodeId) setStartNode(null);
    if (endNode === nodeId) setEndNode(null);
    if (edgeStartNode === nodeId) setEdgeStartNode(null);
    
    setStartNode(prev => prev !== null && prev > nodeId ? prev - 1 : prev);
    setEndNode(prev => prev !== null && prev > nodeId ? prev - 1 : prev);
  }, [isAnimating, startNode, endNode, edgeStartNode]);

  const handleNodeRightClick = useCallback((nodeId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating) return;

    if (startNode === nodeId) {
      setStartNode(null);
    } else if (endNode === nodeId) {
      setEndNode(null);
    } else if (startNode === null) {
      setStartNode(nodeId);
    } else if (endNode === null) {
      setEndNode(nodeId);
    }
  }, [isAnimating, startNode, endNode]);

  const handleNodeDoubleClick = useCallback((nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
    if (isAnimating) return;
    setEdgeStartNode(nodeId);
  }, [isAnimating]);

  const calculateDistance = (node1: Node, node2: Node) => {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const resetGraph = useCallback(() => {
    if (isAnimating) return;
    setNodes([]);
    setEdges([]);
    setStartNode(null);
    setEndNode(null);
    setEdgeStartNode(null);
  }, [isAnimating]);

  const resetVisualization = useCallback(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        visited: false,
        distance: Infinity,
        isPath: false,
        f: undefined,
        g: undefined,
        h: undefined,
      }))
    );
  }, []);

  const visualize = useCallback(async () => {
    if (startNode === null || endNode === null || isAnimating) return;
    
    setIsAnimating(true);
    resetVisualization();

    try {
      const onVisit = (nodeId: number, distance: number) => {
        setNodes((prevNodes) =>
          prevNodes.map((node, i) =>
            i === nodeId ? { ...node, visited: true, distance } : node
          )
        );
      };

      const onPath = (nodeId: number) => {
        setNodes((prevNodes) =>
          prevNodes.map((node, i) =>
            i === nodeId ? { ...node, isPath: true } : node
          )
        );
      };

      switch (selectedAlgorithm) {
        case 'Dijkstra':
          await Dijkstra(nodes, edges, startNode, endNode, onVisit, onPath);
          break;
        case 'BFS':
          await Bfs(nodes, edges, startNode, endNode, onVisit, onPath);
          break;
        case 'DFS':
          await Dfs(nodes, edges, startNode, endNode, onVisit, onPath);
          break;
        case 'A*':
          await Astar(nodes, edges, startNode, endNode, onVisit, onPath);
          break;
      }
    } finally {
      setIsAnimating(false);
    }
  }, [selectedAlgorithm, nodes, edges, startNode, endNode, isAnimating]);

  return (
    <div
      className={`space-y-6 p-8 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="space-y-4">
        <Controls
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
          onVisualize={visualize}
          onReset={resetGraph}
          isAnimating={isAnimating}
          hasValidPath={startNode !== null && endNode !== null}
          darkMode={darkMode}
        />
        
        <div className="text-sm space-y-1 opacity-75">
          <p>• Click anywhere to add a node</p>
          <p>• Right-click a node to set it as start/end point</p>
          <p>• Double-click a node to start creating an edge, then click another node to complete it</p>
          <p>• Click the trash icon on a node to delete it</p>
          {edgeStartNode !== null && (
            <p className="text-indigo-500 font-medium">• Now click another node to create an edge</p>
          )}
        </div>
      </div>

      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`relative w-full h-[600px] rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } ${edgeStartNode !== null ? 'cursor-crosshair' : 'cursor-pointer'}`}
      >
        {edges.map((edge, index) => (
          <GraphEdge
            key={index}
            edge={edge}
            nodes={nodes}
            darkMode={darkMode}
          />
        ))}
        {nodes.map((node, index) => (
          <GraphNode
            key={index}
            node={node}
            index={index}
            isStart={index === startNode}
            isEnd={index === endNode}
            darkMode={darkMode}
            onClick={handleNodeClick}
            onRightClick={handleNodeRightClick}
            onDoubleClick={handleNodeDoubleClick}
            onDelete={handleNodeDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default PathFinder;


