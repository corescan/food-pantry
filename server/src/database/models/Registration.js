const sanitizePhone = require('../../util/sanitizePhone');
const numOrNull = require('../../util/numOrNull');

class Registration {
  constructor(props) {
    this.id = Number(props.id);
    this.phone = sanitizePhone(props.phone);
    if (this.phone && this.phone.length > 10) {
      this.badphone = this.phone;
      this.phone = null;
    }
    this.families = Number(props.families);
    this.call_in_time = props.call_in_time;
    this.time_slot_id = Number(props.time_slot_id);
    this.create_date = props.create_date
    this.check_in_time = props.check_in_time === 'NULL' ? null : props.check_in_time;
    this.client_id = numOrNull(props.client_id);
  }

  getValues() {
    let values = new Array(Registration.columnNames.length)
    for (var i=0; i< Registration.columnNames.length; i++) {
        values[i] = this[Registration.columnNames[i]];
    }
    return values;
}
}

Registration.columnNames = [
  'id',
  'phone',
  'badphone',
  'families',
  'call_in_time',
  'time_slot_id',
  'create_date',
  'check_in_time',
  'client_id'
];

module.exports = Registration;
