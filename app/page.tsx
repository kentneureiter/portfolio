import PixelCanvas from './components/PixelCanvas'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.home}>
      <PixelCanvas />
      <div className={styles.hero}>
        <div className={styles.pixelBox}>
          <h1 className={styles.title}>Kent Neureiter</h1>
          <p className={styles.sub}>Portfolio</p>
        </div>
      </div>
    </main>
  )
}
