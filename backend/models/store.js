const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxLength: 300,
      validate: [nameAvailable, "Store name is invalid"],
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
      required: true,
      maxLength: 3000,
    },
    ownerId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    staffIds: {
      type: [
        {
          type: ObjectId,
          ref: "User",
        },
      ],
      validate: [staffIdsLimit, "The limit is 12 staffs"],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    featured_images: {
      type: [String],
      validate: [featured_imagesLimit, "The limit is 6 images"],
      default: [],
    },
    commissionId: {
      type: ObjectId,
      ref: "Commission",
      required: true,
    },
    e_wallet: {
      type: mongoose.Decimal128,
      min: 0,
      default: 0,
    },
    point: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 3,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

//validators
function featured_imagesLimit(val) {
  return val.length <= 6;
}

function staffIdsLimit(val) {
  return val.length <= 12;
}

function nameAvailable(val) {
  const regexes = [/abc[^\w]*perfume/i, /admin/i];

  let flag = true;
  regexes.forEach((regex) => {
    if (regex.test(val)) {
      flag = false;
    }
  });

  return flag;
}

module.exports = mongoose.model("Store", storeSchema);
