function serialize(doc) {
  if (!doc) return null;
  return typeof doc.toJSON === 'function' ? doc.toJSON() : doc;
}

function serializeMany(docs) {
  return docs.map(serialize);
}

module.exports = { serialize, serializeMany };
