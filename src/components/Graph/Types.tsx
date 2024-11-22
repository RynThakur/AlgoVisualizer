export interface Node {
    x: number;
    y: number;
    id: number;
    visited: boolean;
    distance: number;
    isPath: boolean;
  }
  
  export interface Edge {
    from: number;
    to: number;
    weight: number;
  }
  
  export type Algorithm = 'Dijkstra' | 'A*' | 'BFS' | 'DFS';