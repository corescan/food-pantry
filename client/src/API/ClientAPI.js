import superagent from 'superagent';
import { api } from '../config';
import { toast } from 'react-toastify';

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
    let data = [];
    let res;
    dupes = dupes && dupes.length ? dupes.map(_c => _c.id) : [];
    const payload = {
      true_id: client.id,
      duplicate_ids: dupes
    };

    try {
      res = await superagent
        .post(`${basename}/resolve`)
        .send(payload)
        .set('Accept', 'application/json');
      
      data = res.body.payload;
    } catch (err) {
      console.error(err);
    }

    switch (res.statusCode) {
      case 200: {
        const user_update = data.find(_d => _d.type === 'UPDATE_CLIENT');
        const size = (user_update && user_update.size) || -1;
        toast.success(`Resolved ${size} client${size === 1 ? '':'s'}`)
      }
      break;
      default: {
        toast.error('Uh oh. I think something went wrong.');
      }
    }
    return data;
  }
}

export default ClientAPI;
