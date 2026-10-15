// All project content lives here. To add a project, add an object to
// PROJECTS. The grid and the detail page are both built from this list.
//
// Cover images: drop a file named <slug>.png (or .webp / .jpg) into
// public/projects/ and the card picks it up automatically. Images with a
// transparent background (cut-out objects) look best on the grid.
//
// Any text from "TODO" onward is highlighted on the page so you can
// spot what still needs writing. Delete or replace them before shipping.

export type Challenge = {
  problem: string
  solution: string
}

export type Project = {
  slug: string // URL: /projects/<slug>
  title: string
  tagline: string // one line shown on the card hover + detail header
  role: string
  when: string
  status?: string
  stack: string[]
  overview: string[] // paragraphs
  contributions: string[] // "What I did"
  challenges: Challenge[]
  outcome?: string[]
  links?: { label: string; href: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'mars-rover',
    title: 'Mars Rover',
    tagline: 'Electronics and autonomy software for Lehigh Space Initiative’s University Rover Challenge rover.',
    role: 'Software team member, Lehigh Space Initiative',
    when: 'TODO: start year – present',
    status: 'Ongoing',
    stack: ['ROS2', 'Python', 'TODO: C++? Jetson? sensors?'],
    overview: [
      'Lehigh Space Initiative builds a rover for the University Rover Challenge (URC). I work on the electronics and autonomous driving software.',
      'In Fall 2026 the software team set aside several weeks to build the autonomy stack for URC 2027 together. The team had no autonomy code yet, so we were starting from zero.',
    ],
    contributions: [
      'Ran a ROS2 crash course for the software team, built around our own rover codebase so new members could contribute quickly.',
      'Working on autonomy tasks for URC 2027. TODO: which tasks/nodes you own.',
      'Proposed a drivetrain redesign to the club president and mechanical team to add turn-in-place capability.',
      'TODO: your electronics work',
    ],
    challenges: [
      {
        problem: 'The rover only steers its front two wheels, which limits maneuverability in tight terrain and complicates path following for autonomy.',
        solution: 'Proposed changing the drivetrain to support turning in place. TODO: outcome of the proposal.',
      },
      {
        problem: 'No existing autonomy code and a team with mixed ROS2 experience.',
        solution: 'Taught a ROS2 crash course tied to our codebase so the whole team could build on a shared foundation. TODO: what you built next.',
      },
    ],
    links: [],
  },
  {
    slug: 'resonance-news',
    title: 'Resonance News',
    tagline: 'TODO: one line — e.g. a personalized news aggregator that ranks stories with vector embeddings.',
    role: 'TODO: solo / team + your role',
    when: 'TODO',
    stack: ['TODO: frontend', 'TODO: backend', 'TODO: embedding model / vector DB'],
    overview: ['TODO: what it is and who it is for.'],
    contributions: ['TODO: what you personally built'],
    challenges: [{ problem: 'TODO', solution: 'TODO' }],
    links: [],
  },
  {
    slug: 'air-lab',
    title: 'AIR Lab',
    tagline: 'TODO: one line — control software for autonomous flying drones.',
    role: 'TODO: role / lab',
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
    slug: 'parkalot',
    title: 'ParkALot',
    tagline: 'TODO: one line on what it does.',
    role: 'TODO: team size + your role',
    when: 'TODO: AWS hackathon, date',
    stack: ['AWS', 'TODO: which services', 'TODO: frontend / backend'],
    overview: ['Built at an AWS hackathon. TODO: the problem and what it does.'],
    contributions: ['TODO: what you personally built'],
    challenges: [{ problem: 'TODO', solution: 'TODO' }],
    outcome: ['TODO: placement / demo / what you would build next'],
    links: [],
  },
  {
    slug: 'disaster-vlm',
    title: 'Research: BINA Lab',
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
    tagline: 'A PID controller in ROS2, running on a Jetson Orin Nano.',
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
]

export function getProject(slug: string) {
  return PROJECTS.find(p => p.slug === slug)
}
