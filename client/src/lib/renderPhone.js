export default function renderPhone(phone) {
  if (phone === 'NULL' || typeof phone !== 'string') {
    return '[ null ]';
  }
  const area = phone.substr(0,3);
  const first = phone.substr(3,3);
  const last = phone.substr(6);

  return `${area} ${first} ${last}`;
}
