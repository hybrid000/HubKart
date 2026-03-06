const mongoose = require("mongoose");

/* =========================
   ADDRESS SCHEMA
========================= */
const addressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        alternatePhone: String,

        street1: { type: String, required: true },
        street2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },

        addressType: {
            type: String,
            enum: ["Home", "Office"],
            default: "Home",
        },
    },
    { _id: false }
);

/* =========================
   ORDER ITEM (SNAPSHOT)
========================= */
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productName: String, // snapshot
        productPrice: Number, // snapshot
        discountedPrice: Number, // snapshot

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

/* =========================
   ORDER SCHEMA
========================= */
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            type: addressSchema,
            required: true,
        },

        /* ===== PAYMENT ===== */
        paymentMethod: {
            type: String,
            enum: ["CARD", "UPI", "NET_BANKING", "COD"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },

        transactionId: String,
        paymentProvider: {
            type: String,
            enum: ["STRIPE", "RAZORPAY", "CASH"],
        },

        /* ===== AMOUNTS ===== */
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        shippingFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },

        totalAmount: {
            type: Number,
            required: true,
        },

        /* ===== ORDER STATUS ===== */
        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "PROCESSING",
                "SHIPPED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
        },

        deliveredAt: Date,
        cancelledAt: Date,
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

/* =========================
   INDEXES (IMPORTANT)
========================= */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;