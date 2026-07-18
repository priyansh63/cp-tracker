import mongoose, { Schema, Document } from 'mongoose';

export interface ICodeforcesCache extends Document {
  cfHandle: string;
  profileData: any;
  ratingHistory: any[];
  submissionHistory: any[];
  lastSynced: Date;
}

const CodeforcesCacheSchema: Schema = new Schema({
  cfHandle: { type: String, required: true, unique: true, index: true },
  profileData: { type: Schema.Types.Mixed, default: {} },
  ratingHistory: { type: [Schema.Types.Mixed], default: [] },
  submissionHistory: { type: [Schema.Types.Mixed], default: [] },
  lastSynced: { type: Date, default: Date.now },
});

export default mongoose.model<ICodeforcesCache>('CodeforcesCache', CodeforcesCacheSchema);
