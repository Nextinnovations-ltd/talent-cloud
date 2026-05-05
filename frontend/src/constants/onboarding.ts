export type ExperienceLevel = { id: number; level: string };
export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { id: 1, level: "Junior" },
  { id: 2, level: "Mid-level" },
  { id: 3, level: "Senior" },
  { id: 4, level: "Lead" },
];

export type Skill = { id: number; title: string };
export const SKILLS: Skill[] = [
  { id: 1, title: "python" },
  { id: 2, title: "django" },
  { id: 3, title: "react" },
  { id: 4, title: "javascript" },
  { id: 5, title: "json" },
  { id: 6, title: "webserver" },
  { id: 7, title: "html" },
  { id: 8, title: "css" },
  { id: 9, title: "nodejs" },
  { id: 10, title: "express" },
  { id: 11, title: "mongodb" },
  { id: 12, title: "sql" },
  { id: 13, title: "postgresql" },
  { id: 14, title: "aws" },
  { id: 15, title: "docker" },
  { id: 16, title: "kubernetes" },
  { id: 17, title: "git" },
  { id: 18, title: "restapi" },
  { id: 19, title: "graphql" },
  { id: 20, title: "typescript" },
  { id: 21, title: "angular" },
  { id: 22, title: "vuejs" },
  { id: 23, title: "bootstrap" },
  { id: 24, title: "sass" },
  { id: 25, title: "linux" },
  { id: 26, title: "nginx" },
  { id: 27, title: "apache" },
  { id: 28, title: "redis" },
  { id: 29, title: "kafka" },
  { id: 30, title: "elasticsearch" },
  { id: 31, title: "machinelearning" },
];

export type Specialization = { id: string; name: string; description?: string };
export const SPECIALIZATIONS: Specialization[] = [
  { id: "SP101", name: "Web Development", description: "Building and maintaining websites and web applications." },
  { id: "SP102", name: "Mobile Development", description: "Designing and developing apps for iOS and Android platforms." },
  { id: "SP103", name: "UI/UX Design", description: "Designing user interfaces and experiences to enhance usability and accessibility." },
  { id: "SP104", name: "Graphic / Visual Design", description: "Creating visual content, graphics, and branding for digital and print media." },
  { id: "SP105", name: "System Development", description: "Developing and managing system software, infrastructure, and operations." },
];

export type Role = { id: string; specialization: string; name: string };
export const ROLES: Role[] = [
  { id: "R101", specialization: "SP101", name: "Frontend Developer" },
  { id: "R102", specialization: "SP101", name: "Backend Developer" },
  { id: "R103", specialization: "SP101", name: "Full Stack Developer" },
  { id: "R201", specialization: "SP102", name: "iOS Developer" },
  { id: "R202", specialization: "SP102", name: "Android Developer" },
  { id: "R203", specialization: "SP102", name: "React Native Developer" },
  { id: "R204", specialization: "SP102", name: "Flutter Developer" },
  { id: "R301", specialization: "SP103", name: "UI Designer" },
  { id: "R302", specialization: "SP103", name: "UX Designer" },
  { id: "R303", specialization: "SP103", name: "Product Designer" },
  { id: "R304", specialization: "SP103", name: "Visual Designer" },
  { id: "R305", specialization: "SP103", name: "Interaction Designer" },
  { id: "R306", specialization: "SP103", name: "UI/UX Designer" },
  { id: "R401", specialization: "SP104", name: "Graphic Designer" },
  { id: "R402", specialization: "SP104", name: "Motion Designer" },
  { id: "R403", specialization: "SP104", name: "Brand Designer" },
  { id: "R404", specialization: "SP104", name: "Web Designer" },
  { id: "R501", specialization: "SP105", name: "System Analyst" },
  { id: "R502", specialization: "SP105", name: "System Architect" },
  { id: "R503", specialization: "SP105", name: "Software Engineer" },
  { id: "R504", specialization: "SP105", name: "Database Administrator" },
  { id: "R505", specialization: "SP105", name: "DevOps Engineer" },
  { id: "R506", specialization: "SP105", name: "QA / Test Automation Engineer" },
];

export const getRolesBySpecialization = (specializationId?: string | number): Role[] => {
  if (!specializationId) return [];
  const sid = String(specializationId);
  return ROLES.filter((r) => String(r.specialization) === sid);
};
