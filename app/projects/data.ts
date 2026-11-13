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
  overview?: string[] // paragraphs
  resume?: string[] // resume bullets for this project
  demo?: { youtube?: string; pdf?: string; url?: string; label?: string; caption?: string } // YouTube embed, embedded PDF (e.g. slides) and/or a live link
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
    when: 'June 2026 – present',
    status: 'Ongoing',
    stack: [
      { group: 'Languages', items: ['Python', 'C++'] },
      { group: 'Perception', items: ['NumPy', 'Numba', 'LAB color space', 'Precomputed lookup tables'] },
      { group: 'Simulation', items: ['MuJoCo'] },
      { group: 'Hardware', items: ['ESP32 (wireless comms)', 'ESCs', 'Oscilloscope'] },
      { group: 'Robotics', items: ['PID control', 'SLAM', 'LiDAR'] },
    ],
    overview: [
      'At Lehigh’s Autonomous and Intelligent Robotics (AIR) Lab under Prof. David Saldaña, I sped up the perception pipeline of an autonomous drone for an international flying competition, cutting inference latency from 109ms to 57ms with a precomputed color lookup table and C++ ports of the heaviest functions, then debugged the full hardware and software stack to get it flying. I’m now working on path planning for a spring 2027 competition with Raytheon.',
    ],
    resume: [
      'Developed a custom MuJoCo simulator for autonomous navigation control of a drone swarm, tuning differential equations for robotic control and sim-to-real transfer, and testing object detection and course correction during autonomous flight',
      'Profiled perception code of an autonomous drone stack to identify bottlenecks consuming 86% of total compute, then translated and cross-compiled computation-heavy functions to C++',
      'Cut total inference latency from 109ms to 57ms (47% improvement), with the largest gains from integrating a precomputed lookup table, eliminating redundant per-pixel floating-point computation in the video processing pipeline',
      'Integrated the optimized module into the existing stack, enabling faster autonomous detection and task execution across a multi-drone fleet',
      'Debugged embedded hardware from ESC calibration testing to checking PWM signals on an oscilloscope',
    ],
    sections: [
      {
        heading: 'Ramble',
        blocks: [
          'This past summer, I conducted research under Prof. David Saldaña in Lehigh’s AIR Lab. I was tasked with modifying the perception code and the autonomous control software for a drone to optimize it for a rectangular circuit. This was in preparation for an [autonomous drone competition](https://mecatronica.umng.edu.co/lars-larc2026/) hosted in Colombia in September.',
          'The first few weeks involved trying to understand the codebase, which had been written by a group of PhD students the year prior, and testing the drone to see if everything worked. It didn’t. Although I originally thought I understood the codebase and the components of the drone, debugging is what really tested my understanding of how everything came together.',
          'This is when I was tasked with improving the inference speed of the current computer vision model, which detects and triangulates the guiding balloons (highly reflective red and blue balloons), so that the drone can react faster. This required me to understand how the code detects these colors, but ultimately I wrote tests for most functions to find where the biggest bottleneck was.',
          'When I first talked with my PhD mentor, he mentioned a library called Numba. Numba is an open-source Python compiler designed for math-heavy and array-heavy functions (like NumPy and computer vision math). You add a single decorator (@jit or @njit) above your computation-heavy Python functions, and Numba compiles just those functions into native machine code using LLVM, making them run at C/C++ speeds instead of slow Python speeds. I tried this and it helped significantly, cutting the inference time nearly in half.',
          'There was a problem with Numba, however: it wasn’t going to be able to run locally on the drone. The drone runs on a lightweight custom board that couldn’t run Numba, and there was no way we were fitting a bigger computer on a featherweight drone that needed to be as light as possible.',
          'So I looked further into the code and tested each function individually to see which ones were costing the most time. This let me pinpoint where my efforts would help most. The function taking the most compute was the math that interpreted the balloon colors. The codebase used LAB values instead of RGB (L for perceptual lightness, paired with A for green-to-red and B for blue-to-yellow).',
          'Since this function was using roughly 86% of the inference time, speeding it up would make a big difference. My initial thought was that I would have to convert it to C++, but I realized that many of the values being computed were redundant. This led me to create a lookup table: I precomputed the most common values in simulation and embedded them into the code, so no math needs to be done when associating LAB values with a color. This worked really well, and I saw results similar to Numba, but all running locally.',
          'Eventually, I did convert the computation-heavy functions to C++ as well, cross-compiling them for the drone’s board. Together with the lookup table, this cut total inference latency from 109ms to 57ms.',
          'With the inference speed improved, it was time to get the blimp/drone actually flying properly. This meant everything in the existing code had to work alongside my changes.',
          {
            gallery: [
              { img: '/projects/air-lab/hardware-1.jpeg', alt: 'Drone hardware photo 1' },
              { img: '/projects/air-lab/hardware-2.jpeg', alt: 'Drone hardware photo 2' },
            ],
          },
          'I spent 3 weeks at the end of the summer testing the electronics, the ESP32 wireless communication, the serial port connectivity, the ESC calibration, the startup code, and everything else in the system to find what wasn’t working. Debugging piece after piece that didn’t work really improved my fluency with the drone and the code. Not only did I feel more knowledgeable, but I found many ways to improve the system along the way. Ultimately, there were a few bugs in the code around pin assignments, and the PID control file needed some tweaking, but it worked and I was finally able to move on with the rest of my research. This process, although it was just debugging, has been a rewarding experience and helped me grow as an engineer in ways that building something from scratch might not have.',
          'Since the drone competition ended in September, we have been working with Raytheon on a competition set for spring 2027 that aims to test their brain chip on various AI detection and planning tasks. I have been working on the path planning portion, using what I learned from working on the Mars rover autonomous stack. Recently, we successfully created a SLAM map from a robocar with an onboard lidar.',
        ],
      },
    ],
    links: [],
  },
  {
    slug: 'raiseit',
    title: 'RaiseIt',
    tagline: 'Computer vision that spots raised hands so no question in lecture goes unseen.',
    role: 'Co-creator',
    when: 'February 2025 – present',
    status: 'Ongoing',
    stack: [
      { group: 'Vision / ML', items: ['YOLOv8n-pose', 'ONNX Runtime', 'TensorRT (in progress)', 'ByteTrack (via supervision)', 'OpenCV', 'NumPy'] },
      { group: 'Hardware', items: ['Jetson Orin Nano Super', 'Raspberry Pi 5', 'Logitech Brio 4K'] },
      { group: 'Deployment', items: ['Linux (Ubuntu 24.04 / JetPack)', 'systemd', 'Python venv'] },
    ],
    overview: [
      'RaiseIt is a computer vision system that detects when students raise their hands in large lecture halls and shows the professor who raised their hand first. It runs pose estimation on a camera feed and is built to run on a small edge device in the classroom. I started it with a friend, and I’m now working toward pitching it to Lehigh for use across multiple classrooms.',
    ],
    resume: [
      'Built a computer vision system that detects raised hands in lecture halls using YOLOv8-pose and ByteTrack to track students across frames',
      'Combined a two-model pipeline (YOLO + MediaPipe) into a single pose model and fixed a resizing bug that was distorting students’ proportions',
      'Moved inference from PyTorch to ONNX Runtime for edge deployment on a Raspberry Pi 5 and Jetson Orin Nano',
    ],
    demo: {
      pdf: '/projects/raiseit/slides.pdf',
      label: 'Open the slides',
    },
    sections: [
      {
        heading: 'Ramble',
        blocks: [
          'RaiseIt started as an idea a friend and I had. In a big lecture hall, the professor can’t see everyone, and students in the back row usually get missed when they raise their hand. We worked on it on and off for a while and had a pitch deck and a few scripts, but nothing that worked in a real classroom.',
          'When I went back through the repo, there were six scripts that were mostly different versions of the same idea. They used YOLO to find each person, cropped them out, and ran MediaPipe pose on the crop to check if a wrist was above a shoulder. The best one also had a simple state machine (idle, raising, confirmed, countdown) so someone stretching for a second wouldn’t count. Instead of patching everything, I rebuilt it myself so I actually understood it. I reorganized the repo, rewrote the detection logic as its own class, and added a queue that color-codes students by the order they raised their hands (green, yellow, then red).',
          { img: '/projects/raiseit/early-pipeline.png', alt: 'Early pipeline / codebase map' },
          'Over the summer, MediaPipe removed the part of the library we were using, so I switched to YOLOv8n-pose, which finds people and their keypoints in one model instead of two. While doing this, I found a bug where we were stretching every crop into a square, which threw off people’s proportions and the wrist and shoulder math. I fixed it by padding the image instead (letterboxing). I also replaced our old tracker, which just checked if someone moved less than 50 pixels between frames, with ByteTrack, which works much better in a crowded room.',
          'I also decided to move the model from PyTorch to ONNX Runtime so it could run on smaller hardware. This meant writing the preprocessing and reading the model’s raw output directly, which taught me a lot about what the model is actually returning.',
          { img: '/projects/raiseit/keypoint-output.png', alt: 'Keypoint output / detection example' },
          'Getting it running on hardware took a lot of debugging. On the Raspberry Pi 5, none of the ML libraries would install, and it turned out the OS was running in 32-bit mode on a 64-bit processor. After reflashing it, I moved to a Jetson Orin Nano, since its GPU makes a big difference for real-time detection. The GPU version of ONNX Runtime didn’t support my CUDA version yet, so I switched to TensorRT, which optimizes the model for the Jetson.',
          'The main thing I’m working on now is resolution. The camera records in 4K, but the model only sees a 640×640 image, so students in the back row end up about 40 pixels tall.',
        ],
      },
    ],
    links: [],
  },
  {
    slug: 'coalesce',
    title: 'Coalesce',
    tagline: 'Context Layer for Multi-Agent Workflows',
    role: 'Team of 2',
    when: 'October 2026',
    stack: [
      { group: 'Agent hooks', items: ['Claude Code hooks', 'Python (standard library only)'] },
      { group: 'Backend', items: ['FastAPI', 'Python ast module'] },
      { group: 'AI', items: ['Claude Haiku (background judge)'] },
      { group: 'Database', items: ['Supabase', 'Supabase Realtime'] },
      { group: 'Dashboard', items: ['Single-file HTML'] },
    ],
    overview: [
      'Coalesce is a context layer for teams running several coding agents in parallel. When one agent changes a function, Coalesce works out exactly what changed and tells any other agent that is about to edit code depending on it, right before the edit. Conflicts get caught while the code is being written instead of at the PR. We built it as a team of 2 for a hackathon whose prompt was to redesign something that already exists.',
    ],
    resume: [
      'Built a context layer that gives parallel coding agents live awareness of each other’s changes, injecting short factual notes into an agent’s context right before it edits code affected by another agent’s change',
      'Wrote Claude Code hooks (prompt submit, pre-edit, turn end) in dependency-free Python that fail silently so they never break the agent',
      'Built a FastAPI server that diffs functions before and after each change with Python’s ast module, matches changes to the file about to be edited, and runs a Claude Haiku judge in the background for less obvious cases',
      'Streamed every agent session and note to a live dashboard through Supabase Realtime',
    ],
    demo: {
      youtube: 'https://www.youtube.com/watch?v=V3Oro_giObM',
    },
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          'In our software engineering class this semester, we built part of our team project against the schema we’d all agreed on, but the backend didn’t follow it. Nobody found out until the PR, after the work was done. Coding agents make this worse. Teams now run several agents in parallel, each on its own branch, and they can’t see each other. One agent changes a function and another keeps calling it the old way. The hackathon prompt was to redesign something that exists, so we redesigned when teams find out about each other’s changes: while the code is being written, not at the PR.',
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          'Coalesce gives every coding agent live context about what other agents are changing. When an agent finishes a turn, Coalesce reads the diff and pulls out exactly what changed, like get_user now returning a dict instead of a User. When another agent is about to edit a file that calls that function, Coalesce injects a short factual note into its context right before the edit, so it writes user["email"] instead of user.email. A live dashboard shows every session and animates each note from one agent to the other. We don’t fix code or block edits. The agent does the thinking, and we get it the right fact at the right time.',
        ],
      },
      {
        heading: 'How we built it',
        blocks: [
          { img: '/projects/coalesce/architecture.png', alt: 'Coalesce system architecture diagram' },
          'Claude Code hooks fire when a prompt is sent, before a file edit, and when the agent finishes a turn. They’re written in plain Python with only the standard library and fail silently, so they never break the agent. The hooks talk to a FastAPI server that uses Python’s ast module to compare functions before and after a change. The server matches each change against the file the agent is about to edit and runs a Claude Haiku judge in the background for less obvious cases. Everything lives in Supabase, and the dashboard is a single HTML file that updates live through Supabase Realtime.',
        ],
      },
      {
        heading: 'Challenges we ran into',
        blocks: [
          'In one test, the agent edited a file by running a Python script through Bash instead of using its Edit tool, so our pre-edit hook never fired. We also learned that notes worded like commands get ignored or overreacted to, so we rewrote them as plain facts. And we ran into our own problem: we wrote a contract doc so we could build in parallel, and within hours the server had drifted from it.',
        ],
      },
      {
        heading: 'Accomplishments we’re proud of',
        blocks: [
          'The full loop works with real agents. One agent changes a function, and another agent on a different branch is told about it right before it would have broken something, then adapts.',
        ],
      },
      {
        heading: 'What we learned',
        blocks: [
          'Detecting a change is the easy part. The hard part is deciding who needs to know, when, and how to say it so an agent actually uses it. Agents respond well to context that’s specific and shows up at the moment they need it.',
        ],
      },
      {
        heading: 'What’s next',
        blocks: [
          'We want to catch every kind of edit, support languages beyond Python, and finish support for other agents like Gemini CLI. We also want to add Slack in both directions, plus schema contracts that warn an agent when its change breaks an interface the team agreed on, which is exactly what bit us in class.',
        ],
      },
    ],
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
    when: '2026',
    status: 'In progress',
    stack: ['ROS2 Jazzy', 'Python', 'Jetson Orin Nano', 'Ubuntu 24.04'],
    sections: [
      {
        heading: 'Ramble',
        blocks: [
          'For this project, I implemented a PID controller from scratch, starting with a standalone Python simulation to understand how each gain term shapes the system’s response before moving into ROS 2. The motivation came while I was working on the drone software at the AIR Lab over the summer: I thought this project would be a good way to familiarize myself with the basics of control theory and the math behind it.',
          'I set up ROS 2 Jazzy on a Jetson Orin Nano running JetPack 7.2, which meant working through real environment issues (a rotated apt signing key, workspace sourcing, package structure) rather than following a clean tutorial path. The controller itself runs as a ROS 2 node that subscribes to TurtleSim’s pose topic and publishes velocity commands, closing the loop on an actual simulated robot instead of a toy variable. The main thing I took away was the architecture: event-driven callbacks replacing the simulation loop, and the controller/plant separation that makes the same PID logic portable to real hardware.',
        ],
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
