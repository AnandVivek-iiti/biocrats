import mongoose from 'mongoose';
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be valid'],
    max: [new Date().getFullYear() + 10, 'Year cannot be in the far future']
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
    enum: {
      values: ['B.Tech', 'M.Tech', 'PhD', 'MS'],
      message: '{VALUE} is not a valid program'
    }
  },
  jobRole: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
    minlength: [2, 'Job role must be at least 2 characters long'],
    maxlength: [100, 'Job role cannot exceed 100 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;