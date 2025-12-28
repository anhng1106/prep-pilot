import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import User from "../models/user.model";
import { delete_file, upload_file } from "../utils/cloudinary";

export const register = catchAsyncErrors(
  async (name: string, email: string, password: string) => {
    await dbConnect();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = await User.create({
      name,
      email,
      password,
      authProvider: [{ provider: "credentials", providerId: email }],
    });

    return newUser?._id
      ? { created: true }
      : (() => {
          throw new Error("User registration failed");
        })();
  }
);

export const updateUserProfile = catchAsyncErrors(
  async ({
    name,
    userEmail,
    avatar,
    oldAvatar,
  }: {
    name: string;
    userEmail: string;
    avatar?: string;
    oldAvatar?: string;
  }) => {
    await dbConnect();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const data: {
      name: string;
      profilePicture?: { url: string; id: string };
    } = { name };

    if (avatar) {
      data.profilePicture = await upload_file(avatar, "prep-pilot/avatars");
    }

    if (oldAvatar) {
      await delete_file(oldAvatar);
    }

    await User.findOneAndUpdate({ email: userEmail }, { ...data });

    return { updated: true };
  }
);
