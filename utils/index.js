const moment = require('moment')
module.exports = {
    equal(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }
            return options.inverse()
    },
    getFullNameFirstCharacter(firstname, lastname){
        return firstname.charAt(0)+ lastname.charAt(0)
    },
    formatData(data){
        return moment(data).format("DD.MMM.YYYY")
    }
}

