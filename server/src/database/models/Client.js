const numOrNull = require('../../util/numOrNull');
const sanitizePhone = require('../../util/sanitizePhone');

class Client {
    constructor(props) {
        // convert id to number or null;
        this.id = Number(props.id);

        // trim name
        this.firstname = props.firstname.trim();
        this.lastname = props.lastname.trim();

        // sanitize phone string
        this.phone = sanitizePhone(props.phone)
        if (this.phone && this.phone.length > 10) {
            this.badphone = this.phone;
            this.phone = null;
        }

        this.thisfamilycount = numOrNull(props.thisfamilycount);
        this.youthcount = numOrNull(props.youthcount);
        this.eldercount = numOrNull(props.eldercount);

        this.address = props.address === 'NULL' ? null : props.address;
        this.active = props.active || false;
    }

    getValues() {
        let values = new Array(Client.columnNames.length)
        for (var i=0; i< Client.columnNames.length; i++) {
            values[i] = this[Client.columnNames[i]];
        }
        return values;
    }
}

Client.columnNames = [
    'id',
    'firstname',
    'lastname',
    'phone',
    'badphone',
    'thisfamilycount',
    'youthcount',
    'eldercount',
    'address',
    'active',
    'mapped',
    'permanent'
];

module.exports = Client;
