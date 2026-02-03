/**
 * Global State Management for HireLink
 * Uses Zustand for lightweight, efficient state management
 * Handles both candidate applications and recruiter pipeline data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface Experience {
  yearsOfExperience: string;
  skills: string[];
  portfolioLink: string;
}

export interface ApplicationForm {
  personalInfo: PersonalInfo;
  experience: Experience;
  resumeFile: File | null;
  resumeFileName: string;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  description: string;
  department: string;
  experience: string;
}

export interface Candidate {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  applicationData: ApplicationForm;
  appliedDate: string;
  stage: 'Applied' | 'Reviewed' | 'Interview Scheduled' | 'Offer Sent';
  score?: number;
  notes?: string;
  interviewDate?: string;
  interviewTime?: string;
  offerDetails?: string;
}

export interface HireLinkStore {
  // Application form state
  currentStep: number;
  applicationForm: ApplicationForm;
  setApplicationForm: (form: Partial<ApplicationForm>) => void;
  setCurrentStep: (step: number) => void;
  resetApplicationForm: () => void;

  // Job listings
  jobPostings: JobPosting[];
  selectedJobId: string | null;
  setSelectedJobId: (jobId: string) => void;

  // Candidates pipeline
  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  getCandidateById: (id: string) => Candidate | undefined;

  // View state
  userRole: 'candidate' | 'recruiter';
  setUserRole: (role: 'candidate' | 'recruiter') => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialApplicationForm: ApplicationForm = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
  },
  experience: {
    yearsOfExperience: '',
    skills: [],
    portfolioLink: '',
  },
  resumeFile: null,
  resumeFileName: '',
};

const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    description: 'Build scalable web applications with React and Next.js. Join our team of passionate engineers.',
    department: 'Engineering',
    experience: '5+ years',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    location: 'New York, NY',
    description: 'Work on end-to-end features using modern web technologies. Shape the future of our platform.',
    department: 'Engineering',
    experience: '3+ years',
  },
  {
    id: '3',
    title: 'Product Manager',
    location: 'Remote',
    description: 'Lead product vision and strategy for our core offerings. Drive impact across all departments.',
    department: 'Product',
    experience: '4+ years',
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    location: 'Austin, TX',
    description: 'Design beautiful and intuitive user experiences for millions of users.',
    department: 'Design',
    experience: '2+ years',
  },
];

// ============================================================================
// ZUSTAND STORE WITH PERSISTENCE
// ============================================================================

export const useHireLinkStore = create<HireLinkStore>()(
  persist(
    (set, get) => ({
      // Application form state
      currentStep: 0,
      applicationForm: initialApplicationForm,

      setApplicationForm: (form: Partial<ApplicationForm>) =>
        set((state) => ({
          applicationForm: {
            ...state.applicationForm,
            ...form,
          },
        })),

      setCurrentStep: (step: number) => set({ currentStep: step }),

      resetApplicationForm: () =>
        set({
          currentStep: 0,
          applicationForm: initialApplicationForm,
        }),

      // Job listings
      jobPostings: mockJobPostings,
      selectedJobId: null,
      setSelectedJobId: (jobId: string) => set({ selectedJobId: jobId }),

      // Candidates pipeline
      candidates: [],

      addCandidate: (candidate: Candidate) =>
        set((state) => ({
          candidates: [candidate, ...state.candidates],
        })),

      updateCandidate: (id: string, updates: Partial<Candidate>) =>
        set((state) => ({
          candidates: state.candidates.map((candidate) =>
            candidate.id === id ? { ...candidate, ...updates } : candidate
          ),
        })),

      getCandidateById: (id: string) => {
        const { candidates } = get();
        return candidates.find((c) => c.id === id);
      },

      // View state
      userRole: 'candidate',
      setUserRole: (role: 'candidate' | 'recruiter') =>
        set({ userRole: role }),
    }),
    {
      name: 'hirelink-store', // LocalStorage key
    }
  )
);
