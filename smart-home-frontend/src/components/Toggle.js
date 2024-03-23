import '../toggle.css';

export const Toggle = ({ label, toggled, onClick }) => {
    return (
        <>
            <label className='toggle-label'>
                <input className='toggle-input' type="checkbox" checked={toggled} onChange={onClick} />
                <span className='toggle-span' />
            </label>
            <div>
                <strong className='toggle-strong'>{label}</strong>
            </div>
        </>
    )
}