import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROJECTS, getProject, type Block } from '../data'
import { getCover, publicFileExists } from '../covers'
import styles from './detail.module.css'

// only the slugs in data.ts exist; anything else is a 404
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  return { title: project ? `${project.title} — Kent Neureiter` : 'Project' }
}

// highlights unfinished copy: everything from "TODO" to the end of the string
function Todo({ text }: { text: string }) {
  const i = text.indexOf('TODO')
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className={styles.todo}>{text.slice(i)}</span>
    </>
  )
}

// renders text, turning [label](https://url) into links
function T({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\]\([^)\s]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        return m ? (
          <a key={i} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>
        ) : (
          <Todo key={i} text={part} />
        )
      })}
    </>
  )
}

// pulls the video id out of any YouTube URL (watch?v=, youtu.be/, shorts/)
function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)
  return m ? m[1] : null
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === 'string') return <p><T>{block}</T></p>
  if ('subheading' in block) return <h4 className={styles.subheading}>{block.subheading}</h4>
  // image: show a labeled placeholder until the file is added to /public
  return (
    <figure className={styles.figure}>
      {publicFileExists(block.img) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.img} alt={block.alt} />
      ) : (
        <div className={styles.missing}>Add image: public{block.img}</div>
      )}
      {block.caption && <figcaption><T>{block.caption}</T></figcaption>}
    </figure>
  )
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const cover = getCover(project.slug)
  const index = PROJECTS.indexOf(project)
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <main className={styles.page}>
      <Link href="/projects" className={styles.back}>← All projects</Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.tagline}><T>{project.tagline}</T></p>
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={`${project.title}`} className={styles.cover} />
      )}

      <dl className={styles.meta}>
        <div>
          <dt>Role</dt>
          <dd><T>{project.role}</T></dd>
        </div>
        <div>
          <dt>When</dt>
          <dd><T>{project.when}</T></dd>
        </div>
        {project.status && (
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
        )}
      </dl>

      <section className={styles.section}>
        <h3>Stack</h3>
        <ul className={styles.stack}>
          {project.stack.map(s => (
            <li key={s}><T>{s}</T></li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Overview</h3>
        {project.overview.map((p, i) => (
          <p key={i}><T>{p}</T></p>
        ))}
      </section>

      {project.resume && project.resume.length > 0 && (
        <section className={styles.section}>
          <h3>Resume Entry</h3>
          <ul className={styles.list}>
            {project.resume.map((r, i) => (
              <li key={i}><T>{r}</T></li>
            ))}
          </ul>
        </section>
      )}

      {project.demo && youtubeId(project.demo.youtube) && (
        <section className={styles.section}>
          <h3>Demo</h3>
          <div className={styles.video}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId(project.demo.youtube)}`}
              title={`${project.title} demo`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
          {project.demo.caption && <p className={styles.videoCaption}><T>{project.demo.caption}</T></p>}
        </section>
      )}

      {project.sections?.map(sec => (
        <section key={sec.heading} className={styles.section}>
          <h3>{sec.heading}</h3>
          {sec.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </section>
      ))}

      {project.contributions && project.contributions.length > 0 && (
        <section className={styles.section}>
          <h3>What I did</h3>
          <ul className={styles.list}>
            {project.contributions.map((c, i) => (
              <li key={i}><T>{c}</T></li>
            ))}
          </ul>
        </section>
      )}

      {project.challenges && project.challenges.length > 0 && (
        <section className={styles.section}>
          <h3>Problems &amp; how I solved them</h3>
          {project.challenges.map((c, i) => (
            <div key={i} className={styles.challenge}>
              <p><strong>Problem.</strong> <T>{c.problem}</T></p>
              <p><strong>Solution.</strong> <T>{c.solution}</T></p>
            </div>
          ))}
        </section>
      )}

      {project.outcome && project.outcome.length > 0 && (
        <section className={styles.section}>
          <h3>Outcome</h3>
          {project.outcome.map((p, i) => (
            <p key={i}><T>{p}</T></p>
          ))}
        </section>
      )}

      {project.links && project.links.length > 0 && (
        <section className={styles.section}>
          <h3>Links</h3>
          <ul className={styles.links}>
            {project.links.map(l => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className={styles.next}>
        <span>Next project</span>
        <Link href={`/projects/${next.slug}`}>{next.title} →</Link>
      </nav>
    </main>
  )
}
