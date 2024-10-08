const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.post("/text-to-speech", (req, res) => {
  const { text, lang = "hi" } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Spawn a child process to run the Python script
  const pythonProcess = spawn("python", ["text_to_speech.py", text, lang]);

  pythonProcess.stdout.on("data", (data) => {
    const filename = data.toString().trim();

    // Log the filename and check if it exists
    console.log(`Generated filename: ${filename}`);
    fs.access(filename, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist: ${filename}`);
        return res.status(500).json({ error: "File was not generated" });
      }
      res.sendFile(filename, (err) => {
        if (err) {
          console.error(`Failed to send file: ${err}`);
          return res.status(500).json({ error: "Failed to send the file" });
        }
        // Optionally delete the file after sending
        fs.unlinkSync(filename);
      });
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data.toString()}`); // Log any error messages from the Python script
    res.status(500).json({ error: "Python script error" });
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
