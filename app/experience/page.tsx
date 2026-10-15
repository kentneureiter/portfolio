import styles from './experience.module.css'

export const metadata = {
  title: 'Experience — Kent Neureiter',
}

export default function Experience() {
  return (
    <main className={styles.page}>
      <iframe src="/KentGeneral.pdf" title="Kent Neureiter resume" className={styles.pdf} />
    </main>
  )
}
