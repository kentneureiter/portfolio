'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/reading', label: 'Reading' },
]

const EMAIL = 'kentneu8@gmail.com'

// icon files live in public/icons/
const socials = [
  { href: 'https://github.com/kentneureiter', icon: '/icons/github.png', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/kent-neureiter', icon: '/icons/linkedin.webp', label: 'LinkedIn' },
]

export default function Nav() {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  // copies the email address and briefly shows "Copied!"
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.location.href = `mailto:${EMAIL}` // clipboard blocked: open mail app instead
    }
  }

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>KN</Link>
      <div className={styles.right}>
        <div className={styles.links}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className={styles.socials}>
          {socials.map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className={styles.icon} aria-label={label} title={label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="" />
            </a>
          ))}
          <button type="button" onClick={copyEmail} className={styles.icon} aria-label={`Copy email address (${EMAIL})`} title={`Copy ${EMAIL}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/email.webp" alt="" />
            {copied && <span className={styles.toast}>Copied!</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
