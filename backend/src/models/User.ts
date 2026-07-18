import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  cfHandle: string;
  cfRating: number;
  cfRank: string;
  cfAvatar: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  cfHandle: { type: String, required: true, unique: true, index: true },
  cfRating: { type: Number, default: 0 },
  cfRank: { type: String, default: 'unrated' },
  cfAvatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
