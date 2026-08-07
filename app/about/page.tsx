import styles from './about.module.css'

export const metadata = {
  title: 'About — Kent Neureiter',
}

export default function About() {
  return (
    <main className={styles.page}>
      <h2 className={styles.heading}>About Me</h2>
      <div className={styles.layout}>
        <div className={styles.text}>
          <p>Hello 👋 Thanks for checking out my portfolio.</p>
          <p>
            I am currently a rising junior majoring in Computer Engineering. I
            grew up just outside Boston, Massachusetts, before moving to Tokyo,
            Japan, where I rounded out high school.
          </p>
          <p>
            My introduction to computers came from ID Tech&apos;s summer
            camps when I was younger, where I was exposed to Scratch and
            Arduino programming.
          </p>
          <p>
            Since coming to Lehigh University, I have been exploring
            the facets of computer engineering but have grown a deep
            interest in software systems and software-hardware integration.
            Some specific areas I take interest in are Robotics and Software
            Engineering.
          </p>
          <p>
            One of the first projects I worked on in college stemmed from a
            frustrating grade due to my (supposed) lack of participation in the
            class. The following semester, I sought to create a computer vision
            system that would detect raised hands in lectures to allow for
            greater visibility for student questions and increased awareness
            for professors while teaching.
          </p>
          <p>
            Since then, I have found a growing passion for building software
            and computer systems that aim to reach people in meaningful ways.
          </p>
          <p>
            My engagement on campus has involved being a part of Lehigh Space
            Initiative&apos;s Mars rover team working on electronics and
            autonomous driving software. This past summer, I delved deeper into
            research involving CV/ML models for natural disaster analysis
            (BINA Lab) and control software for autonomous flying drones
            (AIR Lab).
          </p>
          <p>
            I was a Division 1 soccer player my first two years. 
            Although short-lived, it has taught me countless lessons on
            collective effort and dedication to a goal. My journey to college
            soccer was no walk in the park and has allowed me to appreciate
            working on difficult things.
          </p>
          <p>
            As I go through college, I hope to continue to learn the
            engineering skills necessary to do meaningful work post-graduation.
          </p>
        </div>
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about.jpg"
            alt="Kent sitting on coastal cliffs above the ocean"
            className={styles.photo}
          />
        </figure>
      </div>
    </main>
  )
}
