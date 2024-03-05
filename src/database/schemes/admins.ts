import mongoose, { Schema } from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    accessToken: { type: String, select: false },
  },
});

export const AdminModel = mongoose.model("Admin", AdminSchema);

export const getAdminByEmail = (email: string) => AdminModel.findOne({ email });
export const getAdminByAccessToken = (accessToken: string) =>
  AdminModel.findOne({
    "authentication.accessToken": accessToken,
  });
export const getAdminById = (id: string) => AdminModel.findById(id);

export const createAdmin = (values: Record<string, any>) =>
  new AdminModel(values).save().then((admin) => admin.toObject());
export const updateAdminById = (id: string, values: Record<string, any>) =>
  AdminModel.findByIdAndUpdate(id, values, { new: true });
export const deleteAdminById = (id: string) => AdminModel.findByIdAndDelete(id);
