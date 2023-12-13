import mongoose, {Schema} from "mongoose";

const OrderSchema = new mongoose.Schema({
    description: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    userFullName: {type: String, required: true},
    shippingAddress: {type: String, required: true},
    products: [{
        product_id: {type: Schema.Types.ObjectId, ref: 'Product'},
        productVariant: {type: Object},
        count: {type: Number},
    }],
    payment: {
        status: {type: Boolean, required: true},
        amount: {type: String, required: true}
    },
    status: {
        type: String,
        enum: ['processing', 'packing', 'shipping', 'complete'],
        default: 'processing'
    },
    createdAt: { type: Date, default: Date.now }
})

export const OrderModel = mongoose.model('Order', OrderSchema);

export const getOrders = () => OrderModel.find({});
export const createOrder = (values: Record<any, any>) => new OrderModel(values).save().then(order => order.toObject());