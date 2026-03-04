import mongoose, { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db';

export interface IPmfExecutiveSummary extends Document {
  business_id: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  summary?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any; // For strict: false
}

interface IPmfExecutiveSummaryModel extends Model<IPmfExecutiveSummary> {
  getByBusinessId(businessId: string): Promise<IPmfExecutiveSummary | null>;
}

const PmfExecutiveSummarySchema = new Schema<IPmfExecutiveSummary>(
  {
    business_id: { type: Schema.Types.ObjectId, required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, index: true },
    summary: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
    collection: 'pmf_executive_summaries',
  }
);

// Helper to ensure connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

// Static methods
PmfExecutiveSummarySchema.statics.getByBusinessId = async function (businessId: string) {
  await ensureConnection();
  return await this.findOne({
    business_id: new mongoose.Types.ObjectId(businessId),
  }).sort({
    created_at: -1,
  });
};

export const PmfExecutiveSummary = mongoose.model<IPmfExecutiveSummary, IPmfExecutiveSummaryModel>('PmfExecutiveSummary', PmfExecutiveSummarySchema);
