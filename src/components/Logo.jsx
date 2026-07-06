import { Link } from 'react-router-dom'

/**
 * The "tm & co studios" wordmark. Lowercase grotesk in lime,
 * with a tightened ampersand to echo the Figma mark.
 */
export default function Logo({ className = '', onClick, style }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="TM & Co. Studios — home"
      className={`group inline-flex items-baseline font-sans font-bold lowercase tracking-tightest text-lime ${className}`}
      style={style}
    >
      <span>tm</span>
      <span className="px-1 font-normal text-lime/70 transition-colors duration-300 group-hover:text-lime">
        &amp;
      </span>
      <span>co</span>
      <span className="pl-2">studios</span>
    </Link>
  )
}
