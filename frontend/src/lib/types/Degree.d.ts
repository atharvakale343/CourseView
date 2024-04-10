type _FixedRequirement = {
  requirementType: 'fixed';
  course: Course;
};

type _PrefixRequirement = {
  requirementType: 'prefix';
  subjectId: string;
  prefix: string; // looks like "CS300+"
  description?: string; // looks like "A CS 300-level elective"
};

type _AnonymousRequirement = {
  requirementType: 'anonymous';
  designation?: string; // looks like "R1" or "BS"
};

export type AnonymousRequirement = Readonly<_AnonymousRequirement>;
export type PrefixRequirement = Readonly<_PrefixRequirement>;
export type FixedRequirement = Readonly<_FixedRequirement>;

export type Requirement =
  | FixedRequirement
  | PrefixRequirement
  | AnonymousRequirement;

export type Section = {
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
