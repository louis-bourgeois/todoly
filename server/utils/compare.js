const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateValue = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string" && dateOnlyPattern.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
      const originalDate = normalizeDateValue(original[key]);
      const updatedDate = normalizeDateValue(updated[key]);

      
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
