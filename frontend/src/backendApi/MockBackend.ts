import {
  AnonymousRequirement,
  DegreeRequirementAssignment,
  Requirement,
  Section,
  Subsection
} from '../lib/types/Degree';
import { guidGenerator } from '../lib/utils';
import { getCSMajorARRConfig, getGenedARRConfig } from './ArrConfig';

export function getCourses(): Course[] {
  return [
    {
      id: 'COMPSCI|121',
      subjectId: 'COMPSCI',
      number: '121',
      title: 'Intro to Programming',
      titleLong: 'Intro to Programming',
      displayTitle: '121 Intro to Programming',
      credits: '4'
    },
    {
      id: 'COMPSCI|187',
      subjectId: 'COMPSCI',
      number: '187',
      title: 'Data Structures',
      titleLong: 'Data Structures',
      displayTitle: '187 Data Structures',
      credits: '4'
    },
    {
      id: 'COMPSCI|220',
      subjectId: 'COMPSCI',
      number: '220',
      title: 'Programming Methodology',
      titleLong: 'Programming Methodology',
      displayTitle: '220 Programming Methodology',
      credits: '4'
    },
    {
      id: 'COMPSCI|240',
      subjectId: 'COMPSCI',
      number: '240',
      title: 'Reasoning Under Uncertainty',
      titleLong: 'Reasoning Under Uncertainty',
      displayTitle: '240 Reasoning Under Uncertainty',
      credits: '4'
    },
    {
      id: 'COMPSCI|326',
      subjectId: 'COMPSCI',
      number: '326',
      title: 'Web Programming',
      titleLong: 'Web Programming',
      displayTitle: '326 Web Programming',
      credits: '4'
    },
    {
      id: 'MATH|235',
      subjectId: 'MATH',
      number: '235',
      title: 'Intro Linear Algebra',
      titleLong: 'Intro Linear Algebra',
      displayTitle: '235 Intro Linear Algebra',
      credits: '3'
    },
    {
      id: 'MATH|233',
      subjectId: 'MATH',
      number: '233',
      title: 'Multivariate Calculus',
      titleLong: 'Multivariate Calculus',
      displayTitle: '233 Multivariate Calculus',
      credits: '4'
    },
    {
      id: 'MUSIC|150',
      subjectId: 'MUSIC',
      number: '150',
      title: 'Lively Arts',
      titleLong: 'Lively Arts',
      displayTitle: '150 Lively Arts',
      credits: '4'
    },
    {
      id: 'COMPSCI|377',
      subjectLong: 'Computer Science',
      subjectShort: 'CompSci',
      subjectId: 'COMPSCI',
      number: '377',
      topic: null,
      displayTitle: '377 Operating Systems',
      title: 'Operating Systems',
      titleLong: 'Computer Science 377 - Operating Systems',
      description: null,
      hasTopics: false,
      corequisites: null,
      prerequisites: null,
      hasRestrictions: false,
      credits: '4'
    },
    {
      id: 'COMPSCI|383',
      subjectLong: 'Computer Science',
      subjectShort: 'CompSci',
      subjectId: 'COMPSCI',
      number: '383',
      topic: null,
      displayTitle: '383 Artificial Intelligence',
      title: 'Artificial Intelligence',
      titleLong: 'Computer Science 383 - Artificial Intelligence',
      description: null,
      hasTopics: false,
      corequisites: null,
      prerequisites: null,
      hasRestrictions: false,
      credits: '3'
    },
    {
      id: 'COMPSCI|429',
      subjectLong: 'Computer Science',
      subjectShort: 'CompSci',
      subjectId: 'COMPSCI',
      number: '429',
      topic: null,
      displayTitle: '429 Software Engin Proj Management',
      title: 'Software Engin Proj Management',
      titleLong: 'Computer Science 429 - Software Engin Proj Management',
      description: null,
      hasTopics: false,
      corequisites: null,
      prerequisites: null,
      hasRestrictions: false,
      credits: '3'
    },
    {
      id: 'COMPSCI|445',
      subjectLong: 'Computer Science',
      subjectShort: 'CompSci',
      subjectId: 'COMPSCI',
      number: '445',
      topic: null,
      displayTitle: '445 Information Systems',
      title: 'Information Systems',
      titleLong: 'Computer Science 445 - Information Systems',
      description: null,
      hasTopics: false,
      corequisites: null,
      prerequisites: null,
      hasRestrictions: false,
      credits: '3'
    },
    {
      id: 'COMPSCI|446',
      subjectLong: 'Computer Science',
      subjectShort: 'CompSci',
      subjectId: 'COMPSCI',
      number: '446',
      topic: null,
      displayTitle: '446 Search Engines',
      title: 'Search Engines',
      titleLong: 'Computer Science 446 - Search Engines',
      description: null,
      hasTopics: false,
      corequisites: null,
      prerequisites: null,
      hasRestrictions: false,
      credits: '3'
    }
  ];
}

export function getUserCourses(): UserCourse[] {
  const courses = getCourses().reduce(
    (acc, course) => ({ ...acc, [course.number]: course }),
    {}
  );
  return [
    {
      // @ts-ignore
      course: courses['121'],
      semester: 'Spring 2023',
      grade: 'A'
    },
    {
      // @ts-ignore
      course: courses['187'],
      semester: 'Fall 2023',
      grade: 'B+'
    },
    {
      // @ts-ignore
      course: courses['220'],
      semester: 'Spring 2024',
      notes: 'Some notes go here',
      professor: 'Marius Minea'
    },
    {
      // @ts-ignore
      course: courses['240'],
      semester: 'Spring 2024',
      notes: 'Some notes go here'
    },
    {
      // @ts-ignore
      course: courses['326'],
      semester: 'Spring 2024',
      notes: 'Some notes go here'
    },
    {
      // @ts-ignore
      course: courses['150'],
      semester: 'Fall 2023'
    },
    {
      // @ts-ignore
      course: courses['377'],
      semester: 'Spring 2024'
    },
    {
      // @ts-ignore
      course: courses['383'],
      semester: 'Spring 2024'
    },
    {
      // @ts-ignore
      course: courses['429'],
      semester: 'Spring 2024'
    },
    {
      // @ts-ignore
      course: courses['445'],
      semester: 'Spring 2024'
    },
    {
      // @ts-ignore
      course: courses['446'],
      semester: 'Spring 2024'
    }
  ];
}

const taken = false;

export function getRequirementAssignments(): DegreeRequirementAssignment[] {
  const fixedReqsReducer = (
    acc: { [key: string]: Requirement },
    req: Requirement
  ) => {
    if (req.requirementType !== 'fixed') return acc;
    return { ...acc, [req.course.number]: req };
  };
  const csArr = getCSMajorARRConfig();

  // Intro subsection
  const csIntroReqs = csArr.subsections[0].requirements.reduce(
    fixedReqsReducer,
    {}
  );

  // Math subsection
  const csMathReqs = csArr.subsections[1].requirements.reduce(
    fixedReqsReducer,
    {}
  );

  // Core subsection
  const csCoreReqs = csArr.subsections[2].requirements.reduce(
    fixedReqsReducer,
    {}
  );

  // Upper level subsection
  let csUpperReqs = csArr.subsections[3].requirements;

  const genedReqs: Requirement[] = getGenedARRConfig().subsections.reduce(
    (reqs, subsection) => [...reqs, ...subsection.requirements],
    [] as Requirement[]
  );

  const userCourses: { [key: string]: UserCourse } = getUserCourses().reduce(
    (acc, userCourse) => ({
      ...acc,
      [userCourse.course.number]: userCourse
    }),
    {}
  );

  delete userCourses['377']
  delete userCourses['383']
  delete userCourses['429']
  delete userCourses['445']
  delete userCourses['446']
  return Object.entries(userCourses).map(([number, userCourse]) => {
    const status =
      userCourse.semester === 'Spring 2024' ? 'in-progress' : 'completed';
    if (csIntroReqs[number]) {
      return {
        requirement: csIntroReqs[number],
        status: status,
        userCourse: userCourse,
        id: guidGenerator()
      };
    }
    if (csCoreReqs[number]) {
      return {
        requirement: csCoreReqs[number],
        status: status,
        userCourse: userCourse,
        id: guidGenerator()
      };
    }
    if (
      csUpperReqs.length > 0 &&
      (number.startsWith('3') || number.startsWith('4'))
    ) {
      const possibleRequirements = csUpperReqs.filter(
        (req) =>
          req.requirementType === 'prefix' &&
          number.startsWith(req.prefix.charAt(0))
      );
      const takeOne = possibleRequirements[0];
      csUpperReqs = csUpperReqs.filter((req) => req !== takeOne);
      return {
        requirement: takeOne,
        status: status,
        userCourse: userCourses[number],
        id: guidGenerator()
      };
    }
    if (genedReqs.length > 0) {
      const requirement = genedReqs.find(
        (req) =>
          req.requirementType === 'anonymous' && req.requirementId === 'AL/AT'
      );
      return {
        requirement: requirement as Requirement,
        status: status,
        userCourse: userCourses[number],
        id: guidGenerator()
      };
    }
    throw new Error('No requirement found for course ' + number);
  });
}
