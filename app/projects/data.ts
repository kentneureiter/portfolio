// All project content lives here. To add a project, add an object to
// PROJECTS. The grid and the detail page are both built from this list.
//
// Cover images: drop a file named <slug>.png (or .webp / .jpg) into
// public/projects/ and the card picks it up automatically. Images with a
// transparent background (cut-out objects) look best on the grid.
//
// Write links inside any text as [label](https://url).
//
// Any text from "TODO" onward is highlighted on the page so you can
// spot what still needs writing. Delete or replace them before shipping.

export type Challenge = {
  problem: string
  solution: string
}

// One piece of a long-form section: a paragraph (plain string), an image,
// or a small subheading. Images live in public/projects/<slug>/.
export type Block =
  | string
  | { img: string; alt: string; caption?: string }
  | { gallery: { img: string; alt: string }[]; caption?: string } // images side by side
  | { subheading: string }

export type StackGroup = { group: string; items: string[] }

export type Project = {
  slug: string // URL: /projects/<slug>
  title: string
  tagline: string // one line shown on the card hover + detail header
  role: string
  when: string
  status?: string
  stack: (string | StackGroup)[] // plain chips, or grouped rows like { group: 'Backend', items: [...] }
  overview: string[] // paragraphs
  resume?: string[] // resume bullets for this project
  demo?: { youtube?: string; url?: string; label?: string; caption?: string } // YouTube embed and/or a live link
  sections?: { heading: string; blocks: Block[] }[] // long-form writing
  contributions?: string[] // "What I did"
  challenges?: Challenge[]
  outcome?: string[]
  links?: { label: string; href: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'mars-rover',
    title: 'Mars Rover',
    tagline: 'Software for Lehigh Space Initiative’s University Rover Challenge rover.',
    role: 'Software lead, Lehigh Space Initiative',
    when: 'October 2025 – present',
    status: 'Ongoing',
    stack: ['ROS2', 'Python', 'Nav2', 'C++', 'Jetson', 'LiDAR', 'GPS', 'IMU'],
    overview: [
      'Lehigh’s Mars rover team competes in the [University Rover Challenge](https://urc.marssociety.org/). I have worked across the electrical and software sub-teams and am now focused on the autonomous driving software and the state machine.',
    ],
    resume: [
      'Built drivetrain control software (dual-joystick input, per-wheel alignment) in C++/Python, deployed across distributed Raspberry Pi nodes over CAN bus and containerized with Docker for real-time rover control',
      'Wrote a ROS 2 C++ node that drives the rover to GPS waypoints, computing distance and bearing between coordinates and adjusting speed/heading with proportional control',
      'Collaborated across software, electrical, and mechanical sub-teams to integrate control software with hardware components during field testing and iteration',
    ],
    demo: {
      youtube: 'https://www.youtube.com/watch?v=Eyu1dI5hLIE',
      caption: 'Our 2026 end-of-year demo submission.',
    },
    sections: [
      {
        heading: 'Ramble',
        blocks: [
          'I initially joined this team working with the electrical sub-team, as that was a little easier to contribute to right away. When I first looked at the repo, there was a lot of code and many concepts that I didn’t quite understand yet (this was when I knew very little about C++!).',
          { img: '/projects/mars-rover/working-on-floor.png', alt: 'Working on the rover on the floor' },
          'After a few months, I started trying to understand everything in the codebase, from launch to each ROS node. I was learning ROS and C++ on the side while documenting every file I understood.',
          'My main contribution was helping transition from a 6-wheel skid-steering mechanism to a 4-wheel hybrid crab steering setup (the 2 front wheels crab, the 2 back wheels are fixed). This involved changes to the driveline Raspberry Pi as well as the logic behind how the joystick actually controls the rover. As I took on more responsibility, I realized this steering setup was not optimal for our tasks, but at that stage last year it was too late to change.',
          'A big issue during testing was that the 2 front crab wheels often fell out of alignment, so we needed a way for the controls to correct it. We ended up using the side buttons on the joystick controllers to realign the left wheel to the right. For the spring 2026 submission, we ended up scoring quite poorly.',
          'Having decided to pursue research this past summer, I also had the opportunity to keep working on the rover. This gave me the time to really understand how the code worked and learn the fundamentals of networking, containerization, and the deploy scripts that made the whole codebase make a lot more sense.',
          'A big task I aimed to tackle over the summer was getting the autonomous driving missions implemented. The previous year introduced autonomous driving tasks, but for various reasons our software team wasn’t able to complete them. This was a big goal that I thought was feasible for this school year.',
          'I wrote the software for the waypoint follower node over the summer, and it has been the backbone of what I have been working on since then during the fall.',
          { img: '/projects/mars-rover/nav2-tutorial.png', alt: 'Nav2 tutorial screenshot' },
          'I have watched more tutorials on SLAM and Nav2 concepts, which have really helped me understand path planning. Right now, we are still working on integrating the Nav2 stack into the various autonomous missions.',
          { subheading: 'State Machine' },
          'Alongside the autonomous software, we realized this would be the first time we implement a state machine for rover control. In previous years, the team got by with a boot mode that initialized each node and went straight into manual control, but adding autonomy means we need a state machine to switch between modes.',
          'This is a long-overdue software decision, and it means we can now incorporate every module, like the science team’s software, into our base station controls.',
          'A first draft of what we are thinking is shown in the diagram below. We are implementing it right now as well.',
          { img: '/projects/mars-rover/state-machine.png', alt: 'First draft of the rover state machine' },
        ],
      },
    ],
    links: [],
  },
  {
    slug: 'resonance-news',
    title: 'Resonance News',
    tagline: 'A personalized daily news briefing for college students.',
    role: 'Co-founder, backend lead',
    when: 'March 2026 – present',
    status: 'Live',
    stack: [
      { group: 'Backend', items: ['Python (FastAPI)', 'NumPy', 'igraph + leidenalg', 'feedparser'] },
      { group: 'Frontend', items: ['Next.js', 'Tailwind CSS'] },
      { group: 'Database', items: ['Supabase (Postgres + pgvector)'] },
      { group: 'AI/ML', items: ['OpenAI text-embedding-3-small (embeddings)', 'GPT-4o-mini (world-news importance scoring)', 'GPT-4o (summaries)'] },
      { group: 'Data sources', items: ['Guardian API', 'NewsAPI', 'RSS feeds', 'Jina Reader (full-text extraction)'] },
      { group: 'Hosting', items: ['Railway (backend + cron jobs)', 'Vercel (frontend)'] },
      { group: 'Email', items: ['Resend', 'SPF/DKIM/DMARC on our domain'] },
    ],
    overview: [
      '[Resonance News](https://resonance-news.com) is a personalized daily news briefing for college students. Each user gets a curated email every morning with articles picked for their interests and things they want to learn about, plus a short section of the most important world news. I co-founded it and own the backend: the scraping, the ML ranking pipeline, and the infrastructure that runs it every day.',
    ],
    resume: [
      'Full-stack AI news platform delivering personalized daily briefings to 50+ active users',
      'Converts free-text onboarding responses into structured interest vectors, bootstrapping recommendations with no click history',
      'Designed an information retrieval pipeline that ingests 500+ articles/day from RSS feeds and the Guardian’s API, embeds them with OpenAI’s model, and applies Leiden graph clustering to group related coverage and deduplicate similar topics across outlets',
      'Implemented cosine similarity ranking against user interest vectors, scoring both topical focus and cross-topic relevance to keep briefings varied',
    ],
    demo: {
      url: 'https://resonance-news.com',
      label: 'Visit resonance-news.com',
    },
    sections: [
      {
        heading: 'Ramble',
        blocks: [
          'This project started out as a simple idea from my friend last spring. Starting out, we had very little exposure to vector embeddings and recommendation systems, so a lot of the early work was just figuring out what we were even building. The core idea was simple: turn every article and every user into a vector, and recommend the articles that sit closest to each user. Actually making that work every single morning, without someone babysitting it, was a whole different problem.',
          {
            gallery: [
              { img: '/projects/resonance-news/whiteboard-1.png', alt: 'Early whiteboard sketch 1' },
              { img: '/projects/resonance-news/whiteboard-2.png', alt: 'Early whiteboard sketch 2' },
              { img: '/projects/resonance-news/whiteboard-3.png', alt: 'Early whiteboard sketch 3' },
            ],
          },
          'The first thing I had to understand was cosine similarity, since that’s how we decide whether an article “matches” a user. I could have imported it from scikit-learn, but I ended up writing it directly in NumPy. It’s only a few lines, and doing it myself made me understand what was going on. One thing that surprised me was how compressed the similarity scores are with high-dimensional embeddings. Almost everything lands in a narrow band, so a threshold that sounds low on paper (around 0.25) ended up being the right cutoff for “relevant.”',
          'The next big problem was duplicates. When something major happens, ten outlets write the same story, and our early briefings would show the same event three times in one email. To fix this, I learned about graph clustering. We build a similarity graph between articles and run Leiden clustering on it, so articles covering the same story get grouped together. The ranker then only pulls one article per cluster. We originally allowed two per cluster and didn’t realize that was the source of a lot of repetitive briefings until we looked closely at real emails.',
          { img: '/projects/resonance-news/pipeline-diagram.png', alt: 'Pipeline architecture diagram' },
          'We also realized one vector per user wasn’t enough. People read the news for what they already care about, but also for things they want to get better at understanding. So each user now has two vectors, one for interests and one for learning goals, ranked independently with their own slots in the email. On top of that, there’s a world news section, where GPT-4o-mini scores Guardian world articles by importance, with a 7-day rolling dedup so the same ongoing story doesn’t show up every day.',
          { img: '/projects/resonance-news/briefing-email.png', alt: 'A real briefing email' },
          'The part I probably learned the most from wasn’t the ML at all. It was everything around it. The whole pipeline runs as cron jobs on Railway, and I ran into plenty of bugs that only show up in deployment, like environment variables loading after the database client had already initialized, or each Railway service needing its own keys updated separately. Getting emails to land in inboxes instead of spam meant learning what SPF, DKIM, and DMARC actually are. Once we had real users, I went back and did a security pass: enabling row-level security in Supabase, locking down an endpoint that anyone could have hit to trigger the pipeline, and tightening our CORS settings. None of that is flashy, but it was the first time I’d built something where other people depended on it working every morning.',
          { img: '/projects/resonance-news/railway-dashboard.png', alt: 'Railway dashboard and cron logs' },
        ],
      },
    ],
    links: [],
  },
  {
    slug: 'air-lab',
    title: 'AIR Lab',
    tagline: 'Software for controlling autonomous drones and improving object detection speed.',
    role: 'Undergraduate Research Assistant',
    when: 'TODO: Summer 2026?',
    stack: ['TODO'],
    overview: ['I worked on control software for autonomous flying drones. TODO: the lab, the drone platform and the goal.'],
    contributions: ['TODO: what you personally built'],
    challenges: [{ problem: 'TODO', solution: 'TODO' }],
    links: [],
  },
  {
    slug: 'raiseit',
    title: 'Raiseit',
    tagline: 'Computer vision that spots raised hands so no question in lecture goes unseen.',
    role: 'Solo project',
    when: 'TODO: semester / year',
    stack: ['Python', 'YOLOv8', 'ByteTrack', 'TODO: OpenCV? hardware/camera?'],
    overview: [
      'After a frustrating participation grade, I set out to build a system that makes raised hands in a lecture hall impossible to miss, giving students better visibility for their questions and instructors a clearer view of the room.',
      'TODO: one or two sentences on how it works end to end (camera → detection → tracking → alert/output).',
    ],
    contributions: [
      'TODO: how you used YOLOv8 (pretrained pose/detection model? fine-tuned on your own data?)',
      'TODO: how ByteTrack keeps a consistent ID per student across frames',
      'TODO: how the result is surfaced to the instructor',
    ],
    challenges: [
      {
        problem: 'TODO: a real problem you hit (e.g. false positives from stretching, small/occluded hands in the back rows, frame rate)',
        solution: 'TODO: what you changed and why it worked',
      },
    ],
    outcome: ['TODO: accuracy / FPS / where it was tested / what you would do next'],
    links: [],
  },
  {
    slug: 'coalesce',
    title: 'Coalesce',
    tagline: 'Context Layer for Multi-Agent Workflows',
    role: 'Team of 2',
    when: 'October 2026',
    stack: ['TODO'],
    overview: ['TODO: the problem and what it does.'],
    contributions: ['TODO: what you personally built'],
    challenges: [{ problem: 'TODO', solution: 'TODO' }],
    links: [],
  },
  {
    slug: 'disaster-vlm',
    title: 'BINA Lab',
    tagline: 'A 3D vision-language model for assessing disaster damage from aerial point clouds.',
    role: 'Undergraduate researcher, under Prof. Rahnemoonfar',
    when: 'TODO: Summer 2026 – present',
    status: 'Ongoing',
    stack: ['UAV point clouds', 'Vision-language models', 'VQA', 'TODO: annotation tools / Python libs'],
    overview: [
      'At Lehigh’s BINA Lab I contribute to a 3D vision-language model project for aerial disaster assessment. The model answers questions about damage using point clouds captured by UAVs.',
    ],
    contributions: [
      'Designed parts of the visual question answering (VQA) question bank and helped plan the dataset.',
      'Annotated data for the 3D-VLM dataset.',
      'Summarized related work (FloodNet, EarthVQA, DisasterM3, fCLIPSeg) with a fellow undergrad and presented findings to the research group.',
      'Reviewed CLEVR3D and E2E-MPCQA for group presentations, pulling out applicable techniques such as point cloud resolution ablation and Mamba/SSM-based fusion.',
    ],
    challenges: [
      {
        problem: 'Damage is easiest to judge against what a site looked like before the disaster, and aerial post-disaster data often lacks that baseline.',
        solution: 'Independently proposed using Google Street View imagery as a pre-disaster reference, while flagging its licensing constraints.',
      },
    ],
    outcome: ['TODO: paper status / acknowledgement once published'],
    links: [],
  },
  {
    slug: 'turtlesim-pid',
    title: 'TurtleSim PID',
    tagline: 'A PID controller in ROS2',
    role: 'Solo project',
    when: 'TODO',
    status: 'In progress',
    stack: ['ROS2 Jazzy', 'Python', 'Jetson Orin Nano', 'Ubuntu 24.04'],
    overview: [
      'A PID controller that drives the ROS2 TurtleSim turtle to target poses, built as a foundation for control work on real robots.',
    ],
    contributions: [
      'Set up a Jetson Orin Nano with JetPack, Ubuntu 24.04 and ROS2 Jazzy.',
      'Designed a Python node architecture built on event-driven callbacks.',
      'TODO: the controller itself (gains, tuning approach)',
    ],
    challenges: [
      {
        problem: 'ROS2 installation failed on the Jetson because of a GPG key issue.',
        solution: 'TODO: one line on how you fixed it',
      },
    ],
    links: [],
  },
  {
    slug: 'parkalot',
    title: 'ParkALot',
    tagline: 'App for parking availability on college campuses',
    role: 'TODO: team size + your role',
    when: 'TODO: AWS hackathon, date',
    stack: ['AWS', 'TODO: which services', 'TODO: frontend / backend'],
    overview: ['Built at an AWS hackathon. TODO: the problem and what it does.'],
    contributions: ['TODO: what you personally built'],
    challenges: [{ problem: 'TODO', solution: 'TODO' }],
    outcome: ['TODO: placement / demo / what you would build next'],
    links: [],
  },
]

export function getProject(slug: string) {
  return PROJECTS.find(p => p.slug === slug)
}
