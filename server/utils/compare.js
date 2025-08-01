export function compareArrays(original, updated) {
  const added = [];
  const removed = [];
  const modified = [];

  const originalMap = new Map(original.map((item) => [item.id, item]));
  const updatedMap = new Map(updated.map((item) => [item.id, item]));

  
  original.forEach((item) => {
    if (!updatedMap.has(item.id)) {
      removed.push(item);
    } else if (
      JSON.stringify(item) !== JSON.stringify(updatedMap.get(item.id))
    ) {
      modified.push({ before: item, after: updatedMap.get(item.id) });
    }
  });

  
  updated.forEach((item) => {
    if (!originalMap.has(item.id)) {
      added.push(item);
    }
  });

  return { added, removed, modified };
}

export function compareObjects(original, updated) {
  let changes = {};

  Object.keys(updated).forEach((key) => {
    
    if (key.endsWith("_date")) {
      const originalDate = new Date(original[key]).toISOString().slice(0, 10);
      const updatedDate = new Date(updated[key]).toISOString().slice(0, 10);

      
      if (updatedDate !== originalDate) {
        changes[key] = updatedDate;
      }
    } else {
      
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
  });

  return changes;
}