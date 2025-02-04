import { useState, useEffect, useRef } from "react";
import "./App.css";

const paragraph =
  "The quick brown fox jumps over the lazy dog, showcasing the agility of nature’s creatures. Meanwhile, a gentle breeze rustles the golden leaves, whispering secrets of the past. Time flows like a river, carrying memories and dreams along its endless path. In the heart of a bustling city or the solitude of a quiet meadow, every moment holds a story waiting to be written. Embrace the rhythm of the keys and let your thoughts flow freely, for words have the power to shape the world.";

const App = () => {
  const maxTimeLimit = 120; 

  const [remainingTime, setRemainingTime] = useState(maxTimeLimit);
  const [errorCount, setErrorCount] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typingStarted, setTypingStarted] = useState(false);
  const [wordPerMinute, setWordPerMinute] = useState(0);
  const [charFeedback, setCharFeedback] = useState(Array(paragraph.length).fill(""));

  const inputElementRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typingStarted && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
        
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [typingStarted, remainingTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      clearInterval(timerRef.current);
      inputElementRef.current.disabled = true;
    }
  }, [remainingTime]);

  const handleTypingInput = (e) => {
    if (!typingStarted) {
      setTypingStarted(true);
    }

    const typedCharacter = e.target.value.slice(-1);
    const currentCharacter = paragraph[currentCharIndex];

    let updatedFeedback = [...charFeedback];

    if (typedCharacter === currentCharacter) {
      updatedFeedback[currentCharIndex] = "correct";
    } else {
      updatedFeedback[currentCharIndex] = "wrong";
      setErrorCount((prevErrorCount) => prevErrorCount + 1);
    }

    setCharFeedback(updatedFeedback);
    setCurrentCharIndex((prevIndex) => prevIndex + 1);

    // Calculate WPM
    const typedWords = (currentCharIndex + 1) / 5;
    const timeElapsed = maxTimeLimit - remainingTime;
    setWordPerMinute(timeElapsed > 0 ? Math.round((typedWords / timeElapsed) * 60) : 0);
  };

  const restartTest = () => {
    clearInterval(timerRef.current);
    setRemainingTime(maxTimeLimit);
    setErrorCount(0);
    setCurrentCharIndex(0);
    setTypingStarted(false);
    setWordPerMinute(0);
    setCharFeedback(Array(paragraph.length).fill(""));
    inputElementRef.current.value = "";
    inputElementRef.current.disabled = false;
    inputElementRef.current.focus();
  };

  return (
    <div className="container">
      <h1 className="title">Typing Speed Test</h1>

      <div className="paragraph">
        {paragraph.split("").map((char, index) => (
          <span
            key={index}
            className={`char ${index === currentCharIndex ? "active" : ""} ${
              charFeedback[index] || ""
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      <input
        type="text"
        className="input-field"
        ref={inputElementRef}
        onChange={handleTypingInput}
        placeholder="Start typing here..."
      />

      <div>
        <p>Time Left: <strong>{remainingTime} s</strong></p>
        <p>Mistakes Done: <strong>{errorCount}</strong></p>
        <p>Speed in WPM: <strong>{wordPerMinute}</strong></p>
        <p>Speed in CPM: <strong>{currentCharIndex}</strong></p>
        <button className="btn" onClick={restartTest}>Restart</button>
      </div>
    </div>
  );
};

export default App;