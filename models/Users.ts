// File: models/User.ts
// Description: Defines the TypeScript interface and Mongoose schema for user accounts, supporting regular users and administrators.
// Inputs: Name, email, password hash, and role type ('user' or 'admin').
// Processing: Validates unique email entries and assigns default user access levels.
// Outputs: Mongoose User model with strict typing support.

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;