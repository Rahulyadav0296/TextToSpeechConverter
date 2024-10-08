import sys
from gtts import gTTS
import os

if len(sys.argv) < 2:
    print("Usage: python text_to_speech.py <text> <lang>")
    sys.exit(1)

text = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'hi'

try:
    # Convert the input text to speech
    tts = gTTS(text=text, lang=lang, slow=False)
    filename = os.path.abspath("output.mp3")
    
    # Save the converted audio to a file
    tts.save(filename)
    print(filename)  # Output the filename to Node.js
except Exception as e:
    print(f"Error generating speech: {e}", file=sys.stderr)
    sys.exit(1)  # Ensure that the process exits with a failure code
