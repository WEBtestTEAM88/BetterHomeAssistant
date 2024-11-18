import mongoose from 'mongoose';

// Check if models are already defined
const models = mongoose.models;

// Room Schema
const roomSchema = new mongoose.Schema({
  name: String,
  floor: Number,
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});

// Device Schema
const deviceSchema = new mongoose.Schema({
  name: String,
  type: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  state: Boolean,
  value: Number,
  lastUpdated: Date,
  history: [{
    state: Boolean,
    value: Number,
    timestamp: Date
  }]
});

// Scene Schema
const sceneSchema = new mongoose.Schema({
  name: String,
  devices: [{
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    state: Boolean,
    value: Number
  }]
});

// Automation Rule Schema
const automationRuleSchema = new mongoose.Schema({
  name: String,
  condition: {
    type: { type: String },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    value: mongoose.Schema.Types.Mixed,
    operator: String
  },
  actions: [{
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    action: String,
    value: mongoose.Schema.Types.Mixed
  }],
  active: Boolean
});

// Export models, checking if they already exist
export const Room = models.Room || mongoose.model('Room', roomSchema);
export const Device = models.Device || mongoose.model('Device', deviceSchema);
export const Scene = models.Scene || mongoose.model('Scene', sceneSchema);
export const AutomationRule = models.AutomationRule || mongoose.model('AutomationRule', automationRuleSchema); 