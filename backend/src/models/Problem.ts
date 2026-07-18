import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
}

const ProblemSchema: Schema = new Schema({
  contestId: { type: Number, required: true },
  index: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, index: true },
  tags: { type: [String], default: [], index: true },
});

export default mongoose.model<IProblem>('Problem', ProblemSchema);
