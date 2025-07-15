import mongoose from 'mongoose';

const project = new mongoose.Schema({

    projectId:{
type:mongoose.Schema.Types.ObjectId,
ref:'Projects'
    },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expectedEndDate: {
    type: Date,
    required: true
  },
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  }
});

export const projectGlobal = mongoose.model('ProjectGlobal', project);


