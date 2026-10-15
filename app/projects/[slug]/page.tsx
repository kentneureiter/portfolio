import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROJECTS, getProject } from '../data'
import { getCover } from '../covers'
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
function T({ children }: { children: string }) {
  const i = children.indexOf('TODO')
  if (i === -1) return <>{children}</>
  return (
    <>
      {children.slice(0, i)}
      <span className={styles.todo}>{children.slice(i)}</span>
    </>
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

      <section className={styles.section}>
        <h3>What I did</h3>
        <ul className={styles.list}>
          {project.contributions.map((c, i) => (
            <li key={i}><T>{c}</T></li>
          ))}
        </ul>
      </section>

      {project.challenges.length > 0 && (
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
