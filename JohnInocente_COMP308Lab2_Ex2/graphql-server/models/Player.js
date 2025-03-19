const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String },
  ranking: { type: Number, default: 0 },
  tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
});

module.exports = mongoose.model('Player', PlayerSchema);