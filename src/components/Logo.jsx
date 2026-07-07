import { Link } from 'react-router-dom'

export default function Logo({ className = '', onClick, style }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="TM & Co. Studios — home"
      className={`group inline-flex items-center ${className}`}
      style={style}
    >
      <img
        src="/images/logo.svg"
        alt="TM & Co. Studios"
        className="h-[1em] w-auto object-contain"
      />
    </Link>
  )
}
