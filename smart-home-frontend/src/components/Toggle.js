import '../toggle.css';

// import { useState } from 'react'

export const Toggle = ({ label, toggled, onClick }) => {
    // const [isToggled, toggle] = useState(toggled)

    // const callback = () => {
    //     toggle(!isToggled)
    //     onClick(!isToggled)
    // }

    return (
        <>
            <label className='toggle-label'>
                <input className='toggle-input' type="checkbox" checked={toggled} onChange={onClick} />
                <span className='toggle-span' />
                {/* <strong className='toggle-strong'>{label}</strong> */}
            </label>
            <div>
                <strong className='toggle-strong'>{label}</strong>
            </div>
        </>
    )
}