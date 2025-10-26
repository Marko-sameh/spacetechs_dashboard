// Offload heavy computations to web worker
export const createWorker = (fn: () => void) => {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Heavy image processing worker
export const imageProcessingWorker = () => {
  self.onmessage = function(e) {
    const { operation } = e.data;
    
    switch(operation) {
      case 'resize':
        // Resize logic here
        break;
      case 'compress':
        // Compression logic here
        break;
    }
    
    self.postMessage({ result: 'processed' });
  };
};