import {
  AnonymousRequirement,
  Card,
  DegreeRequirementAssignment,
  Requirement
} from './types/Degree';

export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

export function createMarkedAsCompletedCourse(
  req: AnonymousRequirement
): Course {
  return {
    id: guidGenerator(),
    subjectId: req.designation || 'ANONYMOUS',
    number: '',
    title: req.description || 'Anonymous Requirement',
    displayTitle: `Anonymous Requirement`,
    credits: req.credits || '0',
    description: req.description
  };
}

export const testingUserCourse: UserCourse = {
  course: {
    id: 'COMPSCI 121',
    subjectId: 'COMPSCI',
    number: '121',
    title: 'Intro to Problem Solving',
    displayTitle: '121 Intro to Problem Solving',
    credits: '4',
    description: 'This is a course description'
  },
  grade: 'A',
  semester: 'Fall 2021'
};

export function calculateCourseStatus(
  userCourse: UserCourse
): DegreeRequirementAssignment['status'] {
  // TODO Fix this with a time calculation on userCourse.semester
  return userCourse.semester !== 'Spring 2024' ? 'completed' : 'in-progress';
}
export function compareRequirements(
  req1: Requirement,
  req2: Requirement
): boolean {
  if (req1.requirementType === 'fixed' && req2.requirementType === 'fixed') {
    return (
      req1.course.subjectId === req2.course.subjectId &&
      req1.course.number === req2.course.number
    );
  } else if (
    req1.requirementType === 'prefix' &&
    req2.requirementType === 'prefix'
  ) {
    return (
      req1.subjectId === req2.subjectId &&
      req1.prefix === req2.prefix &&
      req1.requirementId === req2.requirementId
    );
  } else if (
    req1.requirementType === 'anonymous' &&
    req2.requirementType === 'anonymous'
  ) {
    return req1.requirementId === req2.requirementId;
  }
  return req1.requirementType === req2.requirementType;
}

export function generateCardsForUser(
  assignments: DegreeRequirementAssignment[],
  requirements: Requirement[]
): Card[] {
  return requirements.map((req) => {
    const assignment = assignments.find((assignment) =>
      compareRequirements(assignment.requirement, req)
    );
    if (assignment) {
      return {
        type: 'assignment',
        assignment
      };
    } else {
      return {
        type: 'requirement',
        requirement: req
      };
    }
  });
}

export function compareUserCourses(
  userCourse1: UserCourse,
  userCourse2: UserCourse
): boolean {
  return userCourse1.course.id === userCourse2.course.id;
}

export function getUnassignedCourses(
  userCourses: UserCourse[],
  assignments: DegreeRequirementAssignment[]
): UserCourse[] {
  return userCourses.filter(
    (userCourse) =>
      !assignments.find((assignment) =>
        compareUserCourses(assignment.userCourse, userCourse)
      )
  );
}
