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
  assumptions?: string;
  success_criteria?: string;
  kill_criteria?: string;
  review_cadence?: string;
  status?: string;
  launch_status?: string;
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
  ai_rank?: number;
  ai_rank_factors?: any;
  ai_rank_score?: number | null;
  allowed_collaborators?: any[];
  created_at?: Date;
  updated_at?: Date;
}

interface IProjectModel extends Model<IProject> {
  getByBusinessId(businessId: string): Promise<IProject[]>;
  getById(projectId: string): Promise<IProject | null>;
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
    assumptions: { type: String },
    success_criteria: { type: String },
    kill_criteria: { type: String },
    review_cadence: { type: String },
    status: { type: String, default: 'draft' },
    launch_status: { type: String },
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
    ai_rank: { type: Number },
    ai_rank_factors: { type: Schema.Types.Mixed },
    ai_rank_score: { type: Number },
    allowed_collaborators: [{ type: Schema.Types.Mixed }],
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

ProjectSchema.statics.getById = async function (projectId: string) {
  await ensureConnection();
  return await this.findById(projectId);
};

export const Project = mongoose.model<IProject, IProjectModel>('Project', ProjectSchema);
