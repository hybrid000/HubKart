const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
/* =========================
   ADDRESS SUB-SCHEMA
========================= */
const addressSchema = new mongoose.Schema(
    {
        label: {
            type: String, // Home, Work, Other
            default: "Home",
        },
        streetOne: { type: String, required: true },
        streetTwo: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: {
            type: String, // string to preserve leading zeros
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        alternateContactNumber: String,
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

/* =========================
   CART ITEM SUB-SCHEMA
========================= */
const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1,
        }
    },
    { _id: false }
);

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false, // VERY IMPORTANT
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: ["ACTIVE", "BLOCKED", "DELETED"],
            default: "ACTIVE",
        },

        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        cart: [cartItemSchema],

        addresses: [addressSchema],

        lastLogin: Date,
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

userSchema.pre("save", async function (next) {
    // Only hash if password is modified
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;