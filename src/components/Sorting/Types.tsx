export interface SortingStep {
    type: 'compare' | 'swap' | 'split' | 'merge' | 'search' | 'select' | 'insert';
    message: string;
    highlightIndices: number[];
  }