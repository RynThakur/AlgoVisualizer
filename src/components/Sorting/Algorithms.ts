export async function bubbleSort(
    array: number[],
    setArray: (arr: number[]) => void,
    setComparing: (indices: number[]) => void,
    setSwapping: (indices: number[]) => void
  ) {
    const arr = [...array];
    const n = arr.length;
  
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          await new Promise((resolve) => setTimeout(resolve, 100));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        setSwapping([]);
      }
    }
    setComparing([]);
  }
  
  export async function mergeSort(
    array: number[],
    setArray: (arr: number[]) => void,
    setComparing: (indices: number[]) => void,
    setSwapping: (indices: number[]) => void
  ) {
    const arr = [...array];
  
    async function merge(left: number, mid: number, right: number) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
  
      while (i < leftArr.length && j < rightArr.length) {
        setComparing([left + i, mid + 1 + j]);
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        if (leftArr[i] <= rightArr[j]) {
          setSwapping([k]);
          arr[k++] = leftArr[i++];
        } else {
          setSwapping([k]);
          arr[k++] = rightArr[j++];
        }
        setArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
  
      while (i < leftArr.length) {
        setSwapping([k]);
        arr[k++] = leftArr[i++];
        setArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
  
      while (j < rightArr.length) {
        setSwapping([k]);
        arr[k++] = rightArr[j++];
        setArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  
    async function mergeSortHelper(left: number, right: number) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    }
  
    await mergeSortHelper(0, arr.length - 1);
    setComparing([]);
    setSwapping([]);
  }
  
  export async function binaryInsertionSort(
    array: number[],
    setArray: (arr: number[]) => void,
    setComparing: (indices: number[]) => void,
    setSwapping: (indices: number[]) => void
  ) {
    const arr = [...array];
  
    async function binarySearch(item: number, low: number, high: number): Promise<number> {
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        setComparing([mid]);
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        if (item === arr[mid]) {
          return mid + 1;
        } else if (item > arr[mid]) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return low;
    }
  
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      const j = await binarySearch(key, 0, i - 1);
  
      setSwapping([i, j]);
      await new Promise((resolve) => setTimeout(resolve, 100));
  
      arr.splice(i, 1);
      arr.splice(j, 0, key);
      setArray([...arr]);
    }
  
    setComparing([]);
    setSwapping([]);
  }
  
  export async function selectionSort(
    array: number[],
    setArray: (arr: number[]) => void,
    setComparing: (indices: number[]) => void,
    setSwapping: (indices: number[]) => void
  ) {
    const arr = [...array];
    const n = arr.length;
  
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
  
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j]);
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
  
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        await new Promise((resolve) => setTimeout(resolve, 100));
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
      }
    }
  
    setComparing([]);
    setSwapping([]);
  }

