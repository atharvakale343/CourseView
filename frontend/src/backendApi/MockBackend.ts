import { getAllCoursesDropdown } from '../client/add_course/CoursesConfig';
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
  const courses = getAllCoursesDropdown()
    .map((sub) => sub.courses)
    .flat()
    .reduce((acc, course) => ({ ...acc, [course.id]: course }), {});

  // @ts-ignore
  console.log(
    'keys',
    Object.keys(courses).filter((id) => id.startsWith('COMPSCI'))
  );
  const ucs = [
    {
      // @ts-ignore
      course: courses['COMPSCI|187'],
      semester: 'Fall 2021',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MATH|132'],
      semester: 'Fall 2021',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|198C'],
      semester: 'Fall 2021',
      grade: 'P',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['ECON|103'],
      semester: 'Fall 2021',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['ENGLWRIT|112'],
      semester: 'Fall 2021',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|230'],
      semester: 'Spring 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|250'],
      semester: 'Spring 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MATH|233'],
      semester: 'Spring 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MATH|235'],
      semester: 'Spring 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['PUBHLTH|160'],
      semester: 'Spring 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|220'],
      semester: 'Fall 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|240'],
      semester: 'Fall 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MUSIC|150'],
      semester: 'Fall 2022',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['CICS|298A'],
      semester: 'Fall 2022',
      grade: 'P',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|311'],
      semester: 'Spring 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['STOCKSCH|171'],
      semester: 'Spring 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['CICS|256'],
      semester: 'Spring 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|390R'],
      semester: 'Spring 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|365'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|453'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|514'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|578'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['PHYSICS|151'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MARKETNG|301'],
      semester: 'Fall 2023',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|345'],
      semester: 'Winter 2024',
      grade: 'A',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|326'],
      semester: 'Spring 2024',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|348'],
      semester: 'Spring 2024',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['MANAGMNT|301'],
      semester: 'Spring 2024',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|590AE'],
      semester: 'Spring 2024',
      transferred: false
    },
    {
      // @ts-ignore
      course: courses['COMPSCI|391M'] || console.log('no course'),
      semester: 'Spring 2024',
      transferred: false
    }
  ];
  console.log(
    'ucs',
    ucs.map((uc) => uc.course.number)
  );
  return ucs;
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

  return Object.entries(userCourses).reduce(
    (formedAssignments, [number, userCourse]) => {
      const status =
        userCourse.semester === 'Spring 2024' ? 'in-progress' : 'completed';
      if (csIntroReqs[number]) {
        formedAssignments.push({
          requirement: csIntroReqs[number],
          status: status,
          userCourse: userCourse,
          id: guidGenerator()
        });
        return formedAssignments;
      }
      if (csCoreReqs[number]) {
        formedAssignments.push({
          requirement: csCoreReqs[number],
          status: status,
          userCourse: userCourse,
          id: guidGenerator()
        });
        return formedAssignments;
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

        if (!takeOne) return formedAssignments;

        csUpperReqs = csUpperReqs.filter((req) => req !== takeOne);
        formedAssignments.push({
          requirement: takeOne,
          status: status,
          userCourse: userCourses[number],
          id: guidGenerator()
        });
        return formedAssignments;
      }
      if (genedReqs.length > 0) {
        const requirement = genedReqs.find(
          (req) =>
            req.requirementType === 'anonymous' && req.requirementId === 'AL/AT'
        );

        if (!requirement) return formedAssignments;

        formedAssignments.push({
          requirement: requirement as Requirement,
          status: status,
          userCourse: userCourses[number],
          id: guidGenerator()
        });
        return formedAssignments;
      }
      throw new Error('No requirement found for course ' + number);
    },
    [] as DegreeRequirementAssignment[]
  );
}
