const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // keep required
    categoryDescription: String,
    categoryAllProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

// Pre-save hook to auto-generate slug
categorySchema.pre('validate', function (next) {
    if (!this.slug && this.categoryName) {
        this.slug = this.categoryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // replace spaces & non-alphanum with -
            .replace(/(^-|-$)/g, '');    // remove leading/trailing -
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;