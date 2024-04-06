import { DegreeRequirementAssignment } from './types/Degree';

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

export const testingUserCourse: UserCourse = {
  course: {
    courseSubjectId: 'COMPSCI',
    courseNumber: '121',
    courseTitle: 'Intro to Problem Solving',
    credits: 4,
    courseDescription: 'This is a course description'
  },
  grade: 'A',
  semester: 'Fall 2021'
};

export function calculateCourseStatus(
  userCourse: UserCourse
): DegreeRequirementAssignment['status'] {
  // TODO Fix this with a time calculation on userCourse.semester
  return Math.random() < 0.5 ? 'completed' : 'in-progress';
}
