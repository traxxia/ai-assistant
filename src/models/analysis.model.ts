
import mongoose, { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db';

export interface IAnalysis extends Document {
  business_id: mongoose.Types.ObjectId;
  analysis_type: string;
  phase?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any; // For strict: false
}

interface IAnalysisModel extends Model<IAnalysis> {
  findByType(businessId: string, analysisType: string): Promise<IAnalysis | null>;
  getAll(businessId: string): Promise<IAnalysis[]>;
  getByPhase(businessId: string, phase: string): Promise<IAnalysis[]>;
  getByFilter(businessId: string, filter?: any): Promise<IAnalysis[]>;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    business_id: { type: Schema.Types.ObjectId, required: true, index: true },
    analysis_type: { type: String, required: true },
    phase: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
    collection: 'analysis',
  }
);

// Helper to ensure connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

// Static methods
AnalysisSchema.statics.findByType = async function (
  businessId: string,
  analysisType: string
) {
  await ensureConnection();
  return await this.findOne({
    business_id: new mongoose.Types.ObjectId(businessId),
    analysis_type: analysisType,
  });
};

AnalysisSchema.statics.getAll = async function (businessId: string) {
  await ensureConnection();
  return await this.find({ business_id: new mongoose.Types.ObjectId(businessId) }).sort({
    created_at: -1,
  });
};

AnalysisSchema.statics.getByPhase = async function (
  businessId: string,
  phase: string
) {
  await ensureConnection();
  return await this.find({
    business_id: new mongoose.Types.ObjectId(businessId),
    phase: phase,
  }).sort({
    created_at: -1,
  });
};

AnalysisSchema.statics.getByFilter = async function (
  businessId: string,
  filter: any = {}
) {
  await ensureConnection();
  const query = {
    business_id: new mongoose.Types.ObjectId(businessId),
    ...filter,
  };
  return await this.find(query).sort({ created_at: -1 });
};

export const Analysis = mongoose.model<IAnalysis, IAnalysisModel>('Analysis', AnalysisSchema);
