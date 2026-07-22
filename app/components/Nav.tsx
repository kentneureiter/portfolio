'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/reading', label: 'Reading' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>KN</Link>
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
    </nav>
  )
}
