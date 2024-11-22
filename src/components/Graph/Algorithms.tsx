import { Node, Edge } from './Types';

//function to get neighbors
const getNeighbors = (nodeId: number, edges: Edge[]): { id: number; weight: number }[] => {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({
      id: edge.from === nodeId ? edge.to : edge.from,
      weight: edge.weight,
    }));
};

// Dijkstra's Algorithm
export async function Dijkstra(
  nodes: Node[],
  edges: Edge[],
  startNode: number,
  endNode: number,
  onVisit: (nodeId: number, distance: number) => void,
  onPath: (nodeId: number) => void
): Promise<void> {
  const distances = new Array(nodes.length).fill(Infinity);
  const previous = new Array(nodes.length).fill(null);
  distances[startNode] = 0;
  const unvisited = new Set(nodes.map((_, i) => i));

  while (unvisited.size > 0) {
    const current = Array.from(unvisited).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    if (distances[current] === Infinity) break;
    if (current === endNode) break;

    unvisited.delete(current);
    await onVisit(current, distances[current]);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const neighbors = getNeighbors(current, edges);
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.id)) continue;
      const newDistance = distances[current] + neighbor.weight;
      if (newDistance < distances[neighbor.id]) {
        distances[neighbor.id] = newDistance;
        previous[neighbor.id] = current;
      }
    }
  }

  let current = endNode;
  while (current !== null && previous[current] !== null) {
    await onPath(current);
    current = previous[current];
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (current === startNode) await onPath(current);
}

// Breadth-First Search
export async function Bfs(
  nodes: Node[],
  edges: Edge[],
  startNode: number,
  endNode: number,
  onVisit: (nodeId: number, distance: number) => void,
  onPath: (nodeId: number) => void
): Promise<void> {
  const queue: number[] = [startNode];
  const visited = new Set<number>();
  const previous = new Array(nodes.length).fill(null);
  const distances = new Array(nodes.length).fill(Infinity);
  distances[startNode] = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === endNode) break;
    
    if (!visited.has(current)) {
      visited.add(current);
      await onVisit(current, distances[current]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const neighbors = getNeighbors(current, edges);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          queue.push(neighbor.id);
          if (distances[neighbor.id] === Infinity) {
            distances[neighbor.id] = distances[current] + 1;
            previous[neighbor.id] = current;
          }
        }
      }
    }
  }

  let current = endNode;
  while (current !== null && previous[current] !== null) {
    await onPath(current);
    current = previous[current];
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (current === startNode) await onPath(current);
}

// Depth-First Search
export async function Dfs(
  nodes: Node[],
  edges: Edge[],
  startNode: number,
  endNode: number,
  onVisit: (nodeId: number, distance: number) => void,
  onPath: (nodeId: number) => void
): Promise<void> {
  const visited = new Set<number>();
  const previous = new Array(nodes.length).fill(null);
  let found = false;

  async function dfsRecursive(current: number, distance: number): Promise<void> {
    if (found || visited.has(current)) return;
    
    visited.add(current);
    await onVisit(current, distance);
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (current === endNode) {
      found = true;
      return;
    }

    const neighbors = getNeighbors(current, edges);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.id)) {
        previous[neighbor.id] = current;
        await dfsRecursive(neighbor.id, distance + 1);
        if (found) break;
      }
    }
  }

  await dfsRecursive(startNode, 0);

  let current = endNode;
  while (current !== null && previous[current] !== null) {
    await onPath(current);
    current = previous[current];
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (current === startNode) await onPath(current);
}

// A* Algorithm
export async function Astar(
  nodes: Node[],
  edges: Edge[],
  startNode: number,
  endNode: number,
  onVisit: (nodeId: number, distance: number) => void,
  onPath: (nodeId: number) => void
): Promise<void> {
  const openSet = new Set<number>([startNode]);
  const closedSet = new Set<number>();
  const previous = new Array(nodes.length).fill(null);
  const gScore = new Array(nodes.length).fill(Infinity);
  const fScore = new Array(nodes.length).fill(Infinity);
  
  gScore[startNode] = 0;
  fScore[startNode] = heuristic(nodes[startNode], nodes[endNode]);

  function heuristic(a: Node, b: Node): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  while (openSet.size > 0) {
    const current = Array.from(openSet).reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === endNode) break;

    openSet.delete(current);
    closedSet.add(current);
    await onVisit(current, gScore[current]);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const neighbors = getNeighbors(current, edges);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.id)) continue;

      const tentativeGScore = gScore[current] + neighbor.weight;
      
      if (!openSet.has(neighbor.id)) {
        openSet.add(neighbor.id);
      } else if (tentativeGScore >= gScore[neighbor.id]) {
        continue;
      }

      previous[neighbor.id] = current;
      gScore[neighbor.id] = tentativeGScore;
      fScore[neighbor.id] = gScore[neighbor.id] + heuristic(nodes[neighbor.id], nodes[endNode]);
    }
  }

  let current = endNode;
  while (current !== null && previous[current] !== null) {
    await onPath(current);
    current = previous[current];
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (current === startNode) await onPath(current);
}