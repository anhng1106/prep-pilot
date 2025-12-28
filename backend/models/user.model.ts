import { userRoles } from "@/constants/constants";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  roles: string[];
  profilePicture: {
    id: string;
    url: string | null;
  };
  password?: string | null;
  authProvider: {
    provider: string;
    providerId: string;
  }[];
  subscription: {
    id: string;
    customerId: string;
    createdAt: Date;
    status: string;
    startDate: Date;
    currentPeriodEnd: Date;
    nextPaymentAttempt: Date;
  };
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

const authProviderSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ["google", "github", "credentials"],
  },
  providerId: { type: String, required: true },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      trim: true,
      unique: [true, "Email already exists."],
      lowercase: true,
    },
    roles: { type: [String], default: ["user"], enum: userRoles },
    profilePicture: {
      id: String,
      url: { type: String, default: null },
    },
    password: {
      type: String,
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
      default: null,
    },
    authProvider: {
      type: [authProviderSchema],
      default: [],
    },
    subscription: {
      id: String,
      customerId: String,
      createdAt: Date,
      status: String,
      startDate: Date,
      currentPeriodEnd: Date,
      nextPaymentAttempt: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

//encrypt password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expire time
  this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); //30 minutes from now

  return resetToken;
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
