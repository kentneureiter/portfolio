import Link from 'next/link'
import { PROJECTS } from './data'
import { getCover } from './covers'
import styles from './projects.module.css'

export const metadata = {
  title: 'Projects — Kent Neureiter',
}

export default function Projects() {
  return (
    <main className={styles.page}>
      <h2 className={styles.heading}>Projects</h2>
      <div className={styles.grid}>
        {PROJECTS.map(p => {
          const cover = getCover(p.slug)
          return (
            <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.card}>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className={styles.cover} />
              ) : (
                <span className={styles.placeholder} aria-hidden />
              )}
              <span className={styles.title}>{p.title}</span>
              <span className={styles.tagline}>{p.tagline}</span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
