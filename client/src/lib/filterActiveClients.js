export default function filterActiveClients(clients) {
  return clients.filter(_c => _c.active);
}