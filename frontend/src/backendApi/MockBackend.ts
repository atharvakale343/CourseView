import {
  Card,
  DegreeRequirementAssignment,
  Requirement
} from '../lib/types/Degree';

export function getCourses(): Course[] {
  return [
    {
      courseSubjectId: 'COMPSCI',
      courseNumber: '121',
      courseTitle: 'Intro to Programming',
      courseDisplayTitle: '121 Intro to Programming',
      credits: 4
    },
    {
      courseSubjectId: 'COMPSCI',
      courseNumber: '187',
      courseTitle: 'Data Structures',
      courseDisplayTitle: '187 Data Structures',
      credits: 4
    },
    {
      courseSubjectId: 'COMPSCI',
      courseNumber: '220',
      courseTitle: 'Programming Methodology',
      courseDisplayTitle: '220 Programming Methodology',
      credits: 4
    },
    {
      courseSubjectId: 'COMPSCI',
      courseNumber: '240',
      courseTitle: 'Reasoning Under Uncertainty',
      courseDisplayTitle: '240 Reasoning Under Uncertainty',
      credits: 4
    },
    {
      courseSubjectId: 'COMPSCI',
      courseNumber: '326',
      courseTitle: 'Web Programming',
      courseDisplayTitle: '326 Web Programming',
      credits: 4
    },
    {
      courseSubjectId: 'MATH',
      courseNumber: '235',
      courseTitle: 'Intro Linear Algebra',
      courseDisplayTitle: '235 Intro Linear Algebra',
      credits: 3
    },
    {
      courseSubjectId: 'MATH',
      courseNumber: '233',
      courseTitle: 'Multivariate Calculus',
      courseDisplayTitle: '233 Multivariate Calculus',
      credits: 4
    },
    {
      courseSubjectId: 'MUSIC',
      courseNumber: '150',
      courseTitle: 'Lively Arts',
      courseDisplayTitle: '150 Lively Arts',
      credits: 4
    }
  ];
}

export function getUserCourses(): UserCourse[] {
  const courses = getCourses().reduce(
    (acc, course) => ({ ...acc, [course.courseNumber]: course }),
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
    }
  ];
}

export function getCSIntroRequirements(): Requirement[] {
  const courses = getCourses().reduce(
    (acc, course) => ({ ...acc, [course.courseNumber]: course }),
    {}
  );
  return [
    {
      requirementType: 'fixed',
      // @ts-ignore
      course: courses['121']
    },
    {
      requirementType: 'fixed',
      // @ts-ignore
      course: courses['187']
    }
  ];
}
export function getCSCoreRequirements(): Requirement[] {
  const courses = getCourses().reduce(
    (acc, course) => ({ ...acc, [course.courseNumber]: course }),
    {}
  );
  return [
    {
      requirementType: 'fixed',
      // @ts-ignore
      course: courses['220']
    },
    {
      requirementType: 'fixed',
      // @ts-ignore
      course: courses['240']
    }
  ];
}
export function getCSUpperLevelRequirements(): Requirement[] {
  return [
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '4XX+',
      description: 'A CS 400+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '4XX+',
      description: 'A CS 400+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      courseSubjectId: 'COMPSCI',
      prefix: '4XX+',
      description: 'A CS 400+ Upper level elective'
    }
  ];
}
export function getGenedRequirements(): Requirement[] {
  return [
    {
      requirementType: 'anonymous'
    },
    {
      requirementType: 'anonymous'
    },
    {
      requirementType: 'anonymous'
    },
    {
      requirementType: 'anonymous'
    }
  ];
}

export function getAllRequirements(): Requirement[] {
  return getCSIntroRequirements()
    .concat(getCSCoreRequirements())
    .concat(getCSUpperLevelRequirements())
    .concat(getGenedRequirements());
}

export function getRequirementAssignments(): DegreeRequirementAssignment[] {
  const fixedReqsReducer = (
    acc: { [key: string]: Requirement },
    req: Requirement
  ) => {
    if (req.requirementType !== 'fixed') return acc;
    return { ...acc, [req.course.courseNumber]: req };
  };
  const csIntroReqs = getCSIntroRequirements().reduce(fixedReqsReducer, {});
  const csCoreReqs = getCSCoreRequirements().reduce(fixedReqsReducer, {});
  let csUpperReqs = getCSUpperLevelRequirements();
  const genedReqs = getGenedRequirements();
  const userCourses: { [key: string]: UserCourse } = getUserCourses().reduce(
    (acc, userCourse) => ({
      ...acc,
      [userCourse.course.courseNumber]: userCourse
    }),
    {}
  );
  return Object.entries(userCourses).map(([courseNumber, userCourse]) => {
    const status =
      userCourse.semester === 'Spring 2024' ? 'in-progress' : 'completed';
    if (csIntroReqs[courseNumber]) {
      return {
        requirement: csIntroReqs[courseNumber],
        status: status,
        userCourse: userCourse
      };
    }
    if (csCoreReqs[courseNumber]) {
      return {
        requirement: csCoreReqs[courseNumber],
        status: status,
        userCourse: userCourse
      };
    }
    if (
      csUpperReqs.length > 0 &&
      (courseNumber.startsWith('3') || courseNumber.startsWith('4'))
    ) {
      const possibleRequirements = csUpperReqs.filter(
        (req) =>
          req.requirementType === 'prefix' &&
          courseNumber.startsWith(req.prefix.charAt(0))
      );
      const takeOne = possibleRequirements[0];
      csUpperReqs = csUpperReqs.filter((req) => req !== takeOne);
      console.log(csUpperReqs);
      return {
        requirement: takeOne,
        status: status,
        userCourse: userCourses[courseNumber]
      };
    }
    if (genedReqs.length > 0) {
      return {
        requirement: genedReqs.pop() as Requirement,
        status: status,
        userCourse: userCourses[courseNumber]
      };
    }
    throw new Error('No requirement found for course ' + courseNumber);
  });
}

export function compareRequirements(
  req1: Requirement,
  req2: Requirement
): boolean {
  if (req1.requirementType === 'fixed' && req2.requirementType === 'fixed') {
    return (
      req1.course.courseSubjectId === req2.course.courseSubjectId &&
      req1.course.courseNumber === req2.course.courseNumber
    );
  } else if (
    req1.requirementType === 'prefix' &&
    req2.requirementType === 'prefix'
  ) {
    return (
      req1.courseSubjectId === req2.courseSubjectId &&
      req1.prefix === req2.prefix
    );
  }
  return req1.requirementType === req2.requirementType;
}

export function generateCardsForUser(
  assignments: DegreeRequirementAssignment[],
  requirements: Requirement[]
): Card[] {
  const assignmentCards: Card[] = assignments.map((assignment) => ({
    type: 'assignment',
    assignment
  }));
  console.log('assignmentCards', assignmentCards);
  const remainingReqs = requirements.filter(
    (req) =>
      !assignmentCards.find(
        (card) =>
          card.type === 'assignment' &&
          card.assignment.requirement.requirementType !== 'prefix' &&
          compareRequirements(card.assignment.requirement, req)
      )
  );
  console.log('remainingReqs', remainingReqs);
  return assignmentCards.concat(
    remainingReqs.map((req) => ({ type: 'requirement', requirement: req }))
  );
}

// TODO
// export function getDegreeSections(): Section[] {}
