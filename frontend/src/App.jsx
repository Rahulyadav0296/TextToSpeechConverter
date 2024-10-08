import axios from "axios";
import React, { useState } from "react";
function App() {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/text-to-speech",
        {
          text: text,
          lang: "hi",
        },
        { responseType: "blob" }
      );

      // create a URL for the audio file and set it in the state
      const url = URL.createObjectURL(new Blob([response.data]));
      setAudioSrc(url);
    } catch (error) {
      console.error("Error generating speech:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Text to Speech Converter</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
        <button type="submit">Convert to Speech</button>
      </form>

      {audioSrc && (
        <div>
          <h2>Generated Audio:</h2>
          <audio controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
