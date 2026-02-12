import mongoose, { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db';

export interface IProject extends Document {
  business_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  project_name: string;
  project_type?: string;
  description?: string;
  why_this_matters?: string;
  strategic_decision?: string;
  accountable_owner?: string;
  key_assumptions?: string[];
  success_criteria?: string;
  kill_criteria?: string;
  review_cadence?: string;
  status?: string;
  learning_state?: string;
  last_reviewed?: Date;
  impact?: string;
  effort?: string;
  risk?: string;
  strategic_theme?: string;
  dependencies?: string;
  high_level_requirements?: string;
  scope_definition?: string;
  expected_outcome?: string;
  success_metrics?: string;
  estimated_timeline?: string;
  budget_estimate?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface IProjectModel extends Model<IProject> {
  getByBusinessId(businessId: string): Promise<IProject[]>;
}

const ProjectSchema = new Schema<IProject>(
  {
    business_id: { type: Schema.Types.ObjectId, required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    project_name: { type: String, required: true },
    project_type: { type: String },
    description: { type: String },
    why_this_matters: { type: String },
    strategic_decision: { type: String },
    accountable_owner: { type: String },
    key_assumptions: [{ type: String }],
    success_criteria: { type: String },
    kill_criteria: { type: String },
    review_cadence: { type: String },
    status: { type: String, default: 'draft' },
    learning_state: { type: String },
    last_reviewed: { type: Date },
    impact: { type: String },
    effort: { type: String },
    risk: { type: String },
    strategic_theme: { type: String },
    dependencies: { type: String },
    high_level_requirements: { type: String },
    scope_definition: { type: String },
    expected_outcome: { type: String },
    success_metrics: { type: String },
    estimated_timeline: { type: String },
    budget_estimate: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
    collection: 'projects',
  }
);

// Helper to ensure connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

// Static methods
ProjectSchema.statics.getByBusinessId = async function (businessId: string) {
  await ensureConnection();
  return await this.find({ business_id: new mongoose.Types.ObjectId(businessId) }).sort({
    created_at: -1,
  });
};

export const Project = mongoose.model<IProject, IProjectModel>('Project', ProjectSchema);
