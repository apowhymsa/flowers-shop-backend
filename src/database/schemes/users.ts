import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    personals: {
        fullName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        avatar: {type: String, required: true}
    },
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    },
    cart: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number},
        variant: {type: Object}
    }]
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find({});
export const setCart = (id: string, values: Record<any, any>) => UserModel.findByIdAndUpdate(id, values, {new: true});
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByPhone = (phoneNumber: string) => UserModel.findOne({
    'personals.phoneNumber': phoneNumber
})
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then(user => user.toObject());
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values, {new: true});
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
