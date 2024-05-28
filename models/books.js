import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    //required: true,
  },
  description: {
    type: String,
    //required: true,
  },
  thumbnail: {
    type: String,
    //required: true,
  },
  stars: {
    type: Number,
    //required: true,
  },
  category: {
    type: Array,
    //required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});
 const Book = mongoose.model('Book', BookSchema);
 export default Book