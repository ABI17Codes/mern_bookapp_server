import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Book from "./models/books.js";
import multer from "multer";


const app = express();

app.use(cors());
// app.use(express.urlencoded( { extended: true } ));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    const data = await Book.find(filter);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
app.get("/api/books/:slug", async (req, res) => {
  try {
    const slugparam =  req.params.slug;
    const data = await Book.findOne({slug:slugparam});
    if (!data) {
      throw new Error("An error occurred while fetching a book.");
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
})
const upload = multer({ storage: storage })

app.post("/api/books", upload.single("thumbnail")  ,async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.file);

    const newBook = new Book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    })

    await Book.create(newBook);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

// app.post("/api/books", async (req, res) => {
//   try {
//     console.log(req.body);

//     const newBook = new Book({
//       title: req.body.title,
//       slug: req.body.slug,
//       stars: req.body.stars,
//       description: req.body.description,
//       category: req.body.category,
//       thumbnail: req.file.thumbnail,
//     })

//     await Book.create(newBook);
//     res.json("Data Submitted");
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while fetching books." });
//   }
// });



app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
  try {

    const bookId = req.body.bookId;

    const updateBook = {
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
    }

    if (req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    await Book.findByIdAndUpdate(bookId, updateBook)
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});



app.delete("/api/books/:id", async(req,res) => {
  const bookId = req.params.id;

  try {
    await Book.deleteOne({_id: bookId});
    res.json("How dare you!" + req.body.bookId);
  } catch (error) {
    res.json(error);
  }
});















app.get("*", (req, res) => {
  res.sendStatus("404");
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connected successfully"))
  .catch((error) => console.error(error));

app.listen(process.env.PORT, () =>
  console.log("Server running on PORT " + process.env.PORT)
);
