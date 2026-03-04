import mongoose, { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db';

export interface IPmfAnalysis extends Document {
  business_id: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  onboarding_data?: Record<string, any>;
  insights?: any[];
  insights_generated_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any; // For strict: false
}

interface IPmfAnalysisModel extends Model<IPmfAnalysis> {
  getByBusinessId(businessId: string): Promise<IPmfAnalysis | null>;
}

const PmfAnalysisSchema = new Schema<IPmfAnalysis>(
  {
    business_id: { type: Schema.Types.ObjectId, required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, index: true },
    onboarding_data: { type: Schema.Types.Mixed },
    insights: { type: Schema.Types.Mixed },
    insights_generated_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
    collection: 'pmf_analyses',
  }
);

// Helper to ensure connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

// Static methods
PmfAnalysisSchema.statics.getByBusinessId = async function (businessId: string) {
  await ensureConnection();
  return await this.findOne({
    business_id: new mongoose.Types.ObjectId(businessId),
  }).sort({
    created_at: -1,
  });
};

export const PmfAnalysis = mongoose.model<IPmfAnalysis, IPmfAnalysisModel>('PmfAnalysis', PmfAnalysisSchema);
