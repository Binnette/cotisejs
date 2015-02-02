'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Contribution Schema
 */
var ContributionSchema = new Schema({
  amount: {
    type: Number,
    min: 0,
    required: 'Please fill your contribution'
  },
  username: {
    type: String,
    default: '',
    required: 'Please fill your name',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Contribution', ContributionSchema);

/**
 * Cotise Schema
 */
var CotiseSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Cotise title',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Cotise description',
    trim: true
  },
  contributions: [ContributionSchema],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

CotiseSchema.virtual('total').get(function () {
  var i, sum = 0;
  if (this.contributions) {
    var size = this.contributions.length;
    for (i = 0; i < size; i++) {
      sum += this.contributions[i] ? this.contributions[i].amount : 0;
    }
  }
  return sum;
});

mongoose.model('Cotise', CotiseSchema);