import AlpineHero from './components/AlpineHero'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.home}>
      <AlpineHero />
      {/* data-hero-tag: AlpineHero measures this box and protects
          it in the reveal mask — the sky never opens behind it,
          and its border dissolves into scattered beige pixels */}
      <div className={styles.hero} data-hero-tag>
        <h1 className={styles.title}>Kent Neureiter</h1>
        <p className={styles.sub}>Portfolio</p>
      </div>
    </main>
  )
}
