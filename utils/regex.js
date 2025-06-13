function fromSearchQuery(query) {
  if (query) {
    query = query.trim().replace(/(?:\s+)/g, "|")
    return new RegExp(String.raw`^.*(?:${query}).*$`, "i")
  }
  return new RegExp(String.raw`.*`, "i")
}


module.exports = {fromSearchQuery}