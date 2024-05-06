type _FixedRequirement = {
  requirementType: 'fixed';
  course: Course;
};

type _PrefixRequirement = {
  requirementType: 'prefix';
  requirementId: string;
  subjectId: string;
  prefix: string; // looks like "CS300+"
  description?: string; // looks like "A CS 300-level elective"
  credits?: string;
};

type _AnonymousRequirement = {
  requirementType: 'anonymous';
  requirementId: string;
  designation?: string; // looks like "R1" or "BS"
  description?: string; // looks like "A breadth requirement"
  credits?: string;
};

export type AnonymousRequirement = Readonly<_AnonymousRequirement>;
export type PrefixRequirement = Readonly<_PrefixRequirement>;
export type FixedRequirement = Readonly<_FixedRequirement>;

export type Requirement =
  | FixedRequirement
  | PrefixRequirement
  | AnonymousRequirement;

export type Section = {
  id: string;
  title: string;
  description: string;
  subsections: Subsection[];
};

export type Subsection = {
  title: string;
  description: string;
  requirements: Requirement[];
};

export type DegreeRequirementAssignment = {
  status: 'in-progress' | 'completed';
  id: string;
  requirement: Requirement;
  userCourse: UserCourse;
};

export type Card =
  | {
      type: 'requirement';
      requirement: Requirement;
    }
  | {
      type: 'assignment';
      assignment: DegreeRequirementAssignment;
    };

export type Subject = {
  id: string;
  short: string;
  long: string;
  title: string;
};
export type Semester = {
  display: string;
  value: string;
};
