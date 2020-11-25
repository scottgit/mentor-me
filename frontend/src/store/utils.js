function reviveDates (obj) {
  function formatDateTime(dateString) {
    const date = new Date(dateString).toLocaleDateString('en-US');
    const time = new Date(dateString).toLocaleTimeString('en-US');
    return {date, time};
  }
  if (obj.createdAt) {
    obj = {...obj, createdAt: formatDateTime(obj.createdAt) }
  }
  if (obj.updatedAt) {
    obj = {...obj, updatedAt: formatDateTime(obj.updatedAt) }
  }
  if (obj.Connections && obj.Connections.createdAt) {
    obj = {...obj, Connections: {...obj.Connections, createdAt: formatDateTime(obj.Connections.createdAt)} }
  }
  return obj;
}

module.exports = {
  reviveDates
}
