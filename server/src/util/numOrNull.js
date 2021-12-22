module.exports = function numOrNull(thing) {
  let val = parseInt(thing);
  return isNaN(val) ? null : val;
}