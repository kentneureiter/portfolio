import fs from 'fs'
import path from 'path'
import styles from './reading.module.css'

export const metadata = {
  title: 'Reading — Kent Neureiter',
}

// proper display titles for each cover file; anything not listed
// falls back to its filename
const TITLES: Record<string, string> = {
  '1984': '1984',
  'allthelightwecannotsee': 'All the Light We Cannot See',
  'foundation': 'Foundation',
  'homegoing': 'Homegoing',
  'marketwizards': 'Market Wizards',
  'beloved': 'Beloved',
  'downandoutinparisandlondon': 'Down and Out in Paris and London',
  'hobbit': 'The Hobbit',
  'janeeyre': 'Jane Eyre',
  'othello': 'Othello',
  'zerotoone': 'Zero to One',
  'greatexpectations': 'Great Expectations',
  'hitchikersguidetothegalaxy': "The Hitchhiker's Guide to the Galaxy",
  'tomorrow': 'Tomorrow, and Tomorrow, and Tomorrow',
  'ddia': 'Designing Data-Intensive Applications',
  'hailmary': 'Project Hail Mary',
  'importanceofbeingearnest': 'The Importance of Being Earnest',
  'stevejobs': 'Steve Jobs',
}

function getYears() {
  const root = path.join(process.cwd(), 'public', 'reading')
  const years = fs
    .readdirSync(root)
    .filter(d => /^\d{4}$/.test(d) && fs.statSync(path.join(root, d)).isDirectory())
    .sort((a, b) => Number(b) - Number(a)) // newest first
  return years.map(year => ({
    year,
    books: fs
      .readdirSync(path.join(root, year))
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map(f => {
        const slug = f.replace(/\.[^.]+$/, '')
        return {
          src: `/reading/${year}/${f}`,
          title: TITLES[slug] ?? slug,
        }
      }),
  }))
}

export default function Reading() {
  const years = getYears()
  return (
    <main className={styles.page}>
      <h2 className={styles.heading}>Reading</h2>
      <p className={styles.intro}>Books I&apos;ve read over the past few years.</p>
      <p className={styles.intro}>Short List/Currently reading: C++ Primer(Josée Lajoie and Stanley B. Lippman), East of Eden(John Steinbeck)</p>
      {years.map(({ year, books }) => (
        <section key={year}>
          <h3 className={styles.year}>{year}</h3>
          <div className={styles.grid}>
            {books.map(({ src, title }) => (
              <figure key={src} className={styles.book}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${title} cover`} className={styles.cover} />
                <figcaption className={styles.title}>{title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
