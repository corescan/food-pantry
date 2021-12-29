import superagent from 'superagent';
import { api } from '../config';

const basename = `${api}/clients`;

const ClientAPI = {
  fetchAll: async () => {
    let data = []
    try {
      const res = await superagent.get(basename);
      console.log('FETCH CLIENTS', res.statusCode, res.body.size);
      data = res.body.payload;
    } catch (err) { 
      console.error(err);
    }

    return data;
  },

  fetchAllMaps: async () => {
    let data = []
    try {
      const res = await superagent.get(`${basename}/map`);
      console.log('FETCH MAP', res.statusCode, res.body.size);
      data = res.body.payload;
    } catch (err) { 
      console.error(err);
    }

    return data;
  },

  resolveClients: async (client, dupes) => {
    dupes = dupes && dupes.length ? dupes.map(_c => _c.id) : [];
    const payload = {
      true_id: client.id,
      duplicate_ids: dupes
    };

    // // ERROR TEST PAYLOAD
    // const payload = {
    //   true_id: 10008,
    //   duplicate_ids: [9, 42, 770]
    // }

    return superagent
        .post(`${basename}/resolve`)
        .send(payload)
        .set('Accept', 'application/json')
        .then(res => {
          return res.body.payload;
        });
  }

}

export default ClientAPI;
