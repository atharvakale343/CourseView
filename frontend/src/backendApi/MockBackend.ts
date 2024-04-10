import {
  Card,
  DegreeRequirementAssignment,
  Requirement,
  Section,
  Subsection
} from '../lib/types/Degree';

export function getCourses(): Course[] {
  return [
    {
      id: 'COMPSCI 121',
      subjectId: 'COMPSCI',
      number: '121',
      title: 'Intro to Programming',
      titleLong: 'Intro to Programming',
      displayTitle: '121 Intro to Programming',
      credits: '4'
    },
    {
      id: 'COMPSCI 187',
      subjectId: 'COMPSCI',
      number: '187',
      title: 'Data Structures',
      titleLong: 'Data Structures',
      displayTitle: '187 Data Structures',
      credits: '4'
    },
    {
      id: 'COMPSCI 220',
      subjectId: 'COMPSCI',
      number: '220',
      title: 'Programming Methodology',
      titleLong: 'Programming Methodology',
      displayTitle: '220 Programming Methodology',
      credits: '4'
    },
    {
      id: 'COMPSCI 240',
      subjectId: 'COMPSCI',
      number: '240',
      title: 'Reasoning Under Uncertainty',
      titleLong: 'Reasoning Under Uncertainty',
      displayTitle: '240 Reasoning Under Uncertainty',
      credits: '4'
    },
    {
      id: 'COMPSCI 326',
      subjectId: 'COMPSCI',
      number: '326',
      title: 'Web Programming',
      titleLong: 'Web Programming',
      displayTitle: '326 Web Programming',
      credits: '4'
    },
    {
      id: 'MATH 235',
      subjectId: 'MATH',
      number: '235',
      title: 'Intro Linear Algebra',
      titleLong: 'Intro Linear Algebra',
      displayTitle: '235 Intro Linear Algebra',
      credits: '3'
    },
    {
      id: 'MATH 233',
      subjectId: 'MATH',
      number: '233',
      title: 'Multivariate Calculus',
      titleLong: 'Multivariate Calculus',
      displayTitle: '233 Multivariate Calculus',
      credits: '4'
    },
    {
      id: 'MUSIC 150',
      subjectId: 'MUSIC',
      number: '150',
      title: 'Lively Arts',
      titleLong: 'Lively Arts',
      displayTitle: '150 Lively Arts',
      credits: '4'
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
    }
  ];
}

export function getCSIntroRequirements(): Requirement[] {
  const courses = getCourses().reduce(
    (acc, course) => ({ ...acc, [course.number]: course }),
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
    (acc, course) => ({ ...acc, [course.number]: course }),
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
      subjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
      prefix: '3XX+',
      description: 'A CS 300+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
      prefix: '4XX+',
      description: 'A CS 400+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
      prefix: '4XX+',
      description: 'A CS 400+ Upper level elective'
    },
    {
      requirementType: 'prefix',
      subjectId: 'COMPSCI',
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
    return { ...acc, [req.course.number]: req };
  };
  const csIntroReqs = getCSIntroRequirements().reduce(fixedReqsReducer, {});
  const csCoreReqs = getCSCoreRequirements().reduce(fixedReqsReducer, {});
  let csUpperReqs = getCSUpperLevelRequirements();
  const genedReqs = getGenedRequirements();
  const userCourses: { [key: string]: UserCourse } = getUserCourses().reduce(
    (acc, userCourse) => ({
      ...acc,
      [userCourse.course.number]: userCourse
    }),
    {}
  );
  return Object.entries(userCourses).map(([number, userCourse]) => {
    const status =
      userCourse.semester === 'Spring 2024' ? 'in-progress' : 'completed';
    if (csIntroReqs[number]) {
      return {
        requirement: csIntroReqs[number],
        status: status,
        userCourse: userCourse
      };
    }
    if (csCoreReqs[number]) {
      return {
        requirement: csCoreReqs[number],
        status: status,
        userCourse: userCourse
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
        userCourse: userCourses[number]
      };
    }
    if (genedReqs.length > 0) {
      return {
        requirement: genedReqs.pop() as Requirement,
        status: status,
        userCourse: userCourses[number]
      };
    }
    throw new Error('No requirement found for course ' + number);
  });
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
    return req1.subjectId === req2.subjectId && req1.prefix === req2.prefix;
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
  const remainingReqs = requirements.filter(
    (req) =>
      !assignmentCards.find(
        (card) =>
          card.type === 'assignment' &&
          card.assignment.requirement.requirementType !== 'prefix' &&
          compareRequirements(card.assignment.requirement, req)
      )
  );
  return assignmentCards.concat(
    remainingReqs.map((req) => ({ type: 'requirement', requirement: req }))
  );
}

// TODO
// export function getDegreeSections(): Section[] {
//   return {}
// }
