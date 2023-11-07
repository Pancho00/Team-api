const Factory = require('factory-girl');
const { Mongoose } = require('mongoose');
const { Schema } = Mongoose;

const Subscription = Mongoose.model('Subscription', new Schema(require('../../src/models/subscription/subscription.schema')));

Factory.define('Subscription', Subscription, {
  name: Factory.chance('word'),
  price: Factory.chance('integer', { min: 1, max: 100 }),
  description: Factory.chance('sentence'),
  clubId: Factory.assoc('Club', '_id'), // Asociación con el modelo Club
});

module.exports = schemaFactory;