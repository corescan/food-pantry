export default function makeFilterState(client, state) {
  client = client || {}
  const noPhone = !client.phone || !client.phone.length || client.phone.toLowerCase().includes('null')
  return {
    firstname: {
      enabled: state ? state.firstname.enabled : (noPhone? true : false),
      value: client.firstname || ''
    },
    lastname: {
      enabled: state ? state.lastname.enabled : (noPhone? true : false),
      value: client.lastname || ''
    },
    phone: {
      enabled: state ? state.phone.enabled : (noPhone? false : true),
      value: client.phone || ''
    },
    address: {
      enabled: state ? state.address.enabled : false,
      value: client.address || ''
    }
  };
}
