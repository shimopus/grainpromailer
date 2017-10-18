const Agenda = require('agenda');
const config = require('config');

const agenda = new Agenda({
    db: {
        address: process.env.MONGODB_URI,
        collection: config.get('agenda.collectionName')
    },
    name: config.get('agenda.queueName')
});

agenda.on('ready', function() {
    agenda.start();
});

module.exports = agenda;