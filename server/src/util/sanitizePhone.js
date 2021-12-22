module.exports = function sanitizePhone(phone) {
  if (!phone || phone.toLowerCase() === 'null') {
    return null;
  }
  phone = phone.replace(/[()-\s]/g,'');
  if (phone.startsWith('1')) {
      phone = phone.substring(1);
  }
  if (phone.startsWith('251251') && phone.length > 10) {
      phone = phone.substring(3);
  }
  return phone;
}