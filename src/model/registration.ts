import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  // College Information
  isFromSakec: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  participantType: [{
    type: String,
    enum: ['inter', 'intra']
  }],
  
  // Personal Details
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: true
  },
  branch: {
    type: String,
    enum: ['COMPS', 'IT', 'EXTC', 'ETRX', 'AI&DS', 'AI&ML', 'OTHER'],
    required: true
  },

  // CSI Membership & Rounds
  isCsiMember: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  selectedRounds: [{
    type: String,
    enum: ['round1', 'round2', 'round3']
  }],

  // Payment Details
  totalAmount: {
    type: Number,
    required: true
  },
  paymentProof: {
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  csiProof: {
    url: {
      type: String,
      required: function(this: any) {
        return this.isCsiMember === 'yes';
      }
    },
    filename: {
      type: String,
      required: function(this: any) {
        return this.isCsiMember === 'yes';
      }
    }
  },

  // Metadata
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Virtual field for full registration ID
RegistrationSchema.virtual('registrationId').get(function(this: mongoose.Document & { _id: mongoose.Types.ObjectId }) {
  return `REG-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Indexes for better query performance
RegistrationSchema.index({ email: 1 }, { unique: true });
RegistrationSchema.index({ phone: 1 });
RegistrationSchema.index({ status: 1 });
RegistrationSchema.index({ registrationDate: 1 });

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;