const getUpdatedFields = (existing, incoming, allowedFields) => {
  const updates = {};
  for (const field of allowedFields) {
    if (
      incoming[field] !== undefined &&
      incoming[field] !== null &&
      incoming[field] !== existing[field]
    ) {
      updates[field] = incoming[field];
    }
  }
  return updates;
};

export default getUpdatedFields;
