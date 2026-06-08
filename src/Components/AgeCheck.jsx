import { useState } from 'react'
import './AgeCheck.css'

const MIN_AGE = 18

export default function AgeVerification({ onVerified }) {
    const [birthdate, setBirthdate] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!birthdate) {
            setError('Vul je geboortedatum in.')
            return
        }

        const birth = new Date(birthdate)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

        if (age < MIN_AGE) {
            setError('Je moet minimaal 18 jaar oud zijn om deze site te bezoeken.')
            return
        }

        localStorage.setItem('age_verified', 'true')
        onVerified()
    }

    return (
        <div className="age-overlay">
            <div className="age-modal">
                <h2>Leeftijdsverificatie</h2>
                <p>Je moet minimaal 18 jaar oud zijn om deze site te bezoeken. Vul je geboortedatum in.</p>
                <input
                    type="date"
                    value={birthdate}
                    onChange={e => { setBirthdate(e.target.value); setError('') }}
                />
                {error && <p className="age-error">{error}</p>}
                <button onClick={handleSubmit}>Bevestigen</button>
            </div>
        </div>
    )
}