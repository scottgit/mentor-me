function reviveDates (obj) {
  if (obj.createdAt) {
    const date = new Date(obj.createdAt).toLocaleDateString('en-US');
    const time = new Date(obj.createdAt).toLocaleTimeString('en-US');
    obj = {...obj, createdAt: {date, time} }
  }
  if (obj.updatedAt) {
    const date = new Date(obj.updatedAt).toLocaleDateString('en-US');
    const time = new Date(obj.updatedAt).toLocaleTimeString('en-US');
    obj = {...obj, updatedAt: {date, time} }
  }
  return obj;
}

module.exports = {
  reviveDates
}
