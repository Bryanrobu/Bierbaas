import { useState, useRef } from "react";
import "./AgeCheck.css";

const MIN_AGE = 18;
const TOO_YOUNG_URL = "https://www.youtube.com/watch?v=qm6V3pmhvUA";

export default function AgeCheck({ onVerified }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const monthRef = useRef();
  const yearRef = useRef();

  const handleInput = (setter, maxLength, nextRef) => (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    setter(val);
    setError("");
    if (val.length === maxLength && nextRef) nextRef.current.focus();
  };

  const handleSubmit = () => {
    const birth = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    );
    if (isNaN(birth) || birth > new Date()) {
      setError("Vul een geldige geboortedatum in.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age >= MIN_AGE) {
      sessionStorage.setItem("age_verified", "true");
      onVerified();
    } else {
      window.location.href = TOO_YOUNG_URL;
    }
  };

  return (
    <div className="age-overlay">
      <div className="age-modal">
        <h2>Leeftijdsverificatie</h2>
        <p>Je moet minimaal 18 jaar oud zijn om deze site te bezoeken.</p>
        <div className="age-date-inputs">
          <input
            className="input-day"
            type="text"
            inputMode="numeric"
            placeholder="DD"
            value={day}
            onChange={handleInput(setDay, 2, monthRef)}
          />
          <span className="separator">/</span>
          <input
            className="input-month"
            type="text"
            inputMode="numeric"
            placeholder="MM"
            value={month}
            onChange={handleInput(setMonth, 2, yearRef)}
            ref={monthRef}
          />
          <span className="separator">/</span>
          <input
            className="input-year"
            type="text"
            inputMode="numeric"
            placeholder="JJJJ"
            value={year}
            onChange={handleInput(setYear, 4, null)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            ref={yearRef}
          />
        </div>
        {error && <p className="age-error">{error}</p>}
        <button onClick={handleSubmit}>Bevestigen</button>
      </div>
    </div>
  );
}