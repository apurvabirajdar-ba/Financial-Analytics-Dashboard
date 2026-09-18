import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id?: number | string;
  amount?: number;
  category?: string;
  status?: string;
  user_id?: string | number;
  user_profile?: string;
  type?: string;
  date?: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

const transactionSchema = new Schema(
  {
    id: { type: Schema.Types.Mixed },
    amount: { type: Number },
    category: { type: String },
    status: { type: String, default: 'completed' },
    user_id: { type: Schema.Types.Mixed },
    user_profile: { type: String },
    type: { type: String },
    date: { type: Date, default: Date.now },
    description: { type: String },
  },
  {
    timestamps: true,
    id: false, // Disables Mongoose's auto-aliasing of `id` to `_id` as an ObjectId
    strict: false, // Permits extra properties from mock/seed data
  }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;