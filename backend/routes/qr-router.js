const express = require("express");
const multer = require("multer");
const QrCode = require("qrcode-reader");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/scan", upload.single("receipt"), async (req, res) => {
  try {
    console.log("📥 File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Correct import for Jimp (named export)
    const { Jimp } = await import("jimp");

    const image = await Jimp.read(req.file.path);
    const qr = new QrCode();

    qr.callback = (err, value) => {
      fs.unlink(req.file.path, () => {}); // cleanup temp file

    //   console.log("✅ QR Value:", value);

      let qrData = {};
      try {
        qrData = JSON.parse(value.result);
      } catch {
        qrData = { description: value.result };
      }

      console.log(qrData);
      return res.status(200).send(qrData) ;
    };

    qr.decode(image.bitmap);
  } catch (error) {
    console.error("🔥 Server error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
