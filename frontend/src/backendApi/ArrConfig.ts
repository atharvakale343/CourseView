import {
  Card,
  DegreeRequirementAssignment,
  Requirement,
  Section,
  Subsection
} from '../lib/types/Degree';

export function getGenedARRConfig(): Section {
  return {
    title: 'General Education Requirements',
    description:
      'Students who enrolled Fall 2018 or later, see requirements below.',
    subsections: [
      {
        title: 'Writing',
        description:
          "College Writing (CW) and Junior Year Writing (To be taken in the student's junior year)",
        requirements: [
          {
            requirementType: 'fixed',
            course: {
              id: 'ENGLWRIT|112',
              subjectLong: 'English Writing Program',
              subjectShort: 'English Wr',
              subjectId: 'ENGLWRIT',
              number: '112',
              topic: null,
              displayTitle: '112 College Writing',
              title: 'College Writing',
              titleLong: 'English Writing Program 112 - College Writing',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '3'
            }
          },
          {
            requirementType: 'anonymous',
            designation: 'JYW'
          }
        ]
      },
      {
        title: 'Basic Mathematics And Analytical Reasoning',
        description:
          'Students must complete one course in Basic Math Skills (R1) or get a satisfactory score on the Basic Mathematics Skills Exemption Test. This requirement can also be satisfied with a higher level course that presupposes knowledge of basic math skills. See the R1 and R2 requirements page for more details.',
        requirements: [
          {
            requirementType: 'anonymous',
            designation: 'R1'
          },
          {
            requirementType: 'anonymous',
            designation: 'R2'
          }
        ]
      },
      {
        title: 'Biological And Physical World',
        description:
          'Each 4-credit course requirement may also be satisfied by two 3-credit courses with the appropriate designation',
        requirements: [
          {
            requirementType: 'anonymous',
            designation: 'BS'
          },
          {
            requirementType: 'anonymous',
            designation: 'PS'
          }
        ]
      },
      {
        title: 'Social World',
        description:
          'Within the Social World requirements, two courses must meet the Social and Cultural Diversity requirement. One course must focus on Diversity in the United States (DU); the other must focus on Global Diversity (DG).',
        requirements: [
          {
            requirementType: 'anonymous',
            designation: 'AL/AT'
          },
          {
            requirementType: 'anonymous',
            designation: 'HS'
          },
          {
            requirementType: 'anonymous',
            designation: 'SB'
          },
          {
            requirementType: 'anonymous',
            designation: 'AL/AT/DB/I/SI'
          }
        ]
      }
      // Integrative Experience was not added here
    ]
  };
}

export function getCSMajorARRConfig(): Section {
  return {
    title: 'Computer Science Major Requirements',
    description: 'Effective Fall 2016',
    subsections: [
      {
        title: 'Two Introductory CS Courses',
        description: '',
        requirements: [
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI 121',
              subjectId: 'COMPSCI',
              number: '121',
              title: 'Intro to Programming',
              titleLong: 'Intro to Programming',
              displayTitle: '121 Intro to Programming',
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI 187',
              subjectId: 'COMPSCI',
              number: '187',
              title: 'Data Structures',
              titleLong: 'Data Structures',
              displayTitle: '187 Data Structures',
              credits: '4'
            }
          }
        ]
      },
      {
        title: 'Four Math Courses',
        description: '',
        requirements: [
          {
            requirementType: 'fixed',
            course: {
              id: 'MATH|131',
              subjectLong: 'Mathematics',
              subjectShort: 'Mathematic',
              subjectId: 'MATH',
              number: '131',
              topic: null,
              displayTitle: '131 Calculus I',
              title: 'Calculus I',
              titleLong: 'Mathematics 131 - Calculus I',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'MATH|132',
              subjectLong: 'Mathematics',
              subjectShort: 'Mathematic',
              subjectId: 'MATH',
              number: '132',
              topic: null,
              displayTitle: '132 Calculus II',
              title: 'Calculus II',
              titleLong: 'Mathematics 132 - Calculus II',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'MATH|233',
              subjectLong: 'Mathematics',
              subjectShort: 'Mathematic',
              subjectId: 'MATH',
              number: '233',
              topic: null,
              displayTitle: '233 Multivariate Calculus',
              title: 'Multivariate Calculus',
              titleLong: 'Mathematics 233 - Multivariate Calculus',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'MATH|235',
              subjectLong: 'Mathematics',
              subjectShort: 'Mathematic',
              subjectId: 'MATH',
              number: '235',
              topic: null,
              displayTitle: '235 Intro Linear Algebra',
              title: 'Intro Linear Algebra',
              titleLong: 'Mathematics 235 - Intro Linear Algebra',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '3'
            }
          }
        ]
      },
      {
        title: 'Four CS Core Courses',
        description:
          'Students are strongly advised not to take 220 and 230, or 240 and 250 together in the same semester.',
        requirements: [
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI|220',
              subjectLong: 'Computer Science',
              subjectShort: 'CompSci',
              subjectId: 'COMPSCI',
              number: '220',
              topic: null,
              displayTitle: '220 Programming Methodology',
              title: 'Programming Methodology',
              titleLong: 'Computer Science 220 - Programming Methodology',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI|230',
              subjectLong: 'Computer Science',
              subjectShort: 'CompSci',
              subjectId: 'COMPSCI',
              number: '230',
              topic: null,
              displayTitle: '230 Computer Systems Principles',
              title: 'Computer Systems Principles',
              titleLong: 'Computer Science 230 - Computer Systems Principles',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI|240',
              subjectLong: 'Computer Science',
              subjectShort: 'CompSci',
              subjectId: 'COMPSCI',
              number: '240',
              topic: null,
              displayTitle: '240 Reasoning Under Uncertainty',
              title: 'Reasoning Under Uncertainty',
              titleLong: 'Computer Science 240 - Reasoning Under Uncertainty',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI|250',
              subjectLong: 'Computer Science',
              subjectShort: 'CompSci',
              subjectId: 'COMPSCI',
              number: '250',
              topic: null,
              displayTitle: '250 Introduction To Computation',
              title: 'Introduction To Computation',
              titleLong: 'Computer Science 250 - Introduction To Computation',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          }
        ]
      },
      {
        title: 'Eight Upper-Level Courses',
        description: '',
        requirements: [
          {
            requirementType: 'fixed',
            course: {
              id: 'COMPSCI|311',
              subjectLong: 'Computer Science',
              subjectShort: 'CompSci',
              subjectId: 'COMPSCI',
              number: '311',
              topic: null,
              displayTitle: '311 Introduction to Algorithms',
              title: 'Introduction to Algorithms',
              titleLong: 'Computer Science 311 - Introduction to Algorithms',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '4'
            }
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '300+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '300+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '300+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '300+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '400+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '400+',
            description: ''
          },
          {
            requirementType: 'prefix',
            subjectId: 'COMPSCI',
            prefix: '400+',
            description: ''
          }
        ]
      },
      {
        title: 'Integrative Experience / JrYr Writing',
        description:
          'Univ requires IE and JYW courses be taken at UMass Amherst. Secondary CS Majors should satisfy IE and JYW Reqs in primary major.',
        requirements: [
          {
            requirementType: 'anonymous',
            designation: 'IE CS320/326'
          },
          {
            requirementType: 'fixed',
            course: {
              id: 'CICS|305',
              subjectLong: 'College of Inform & Comp Sci',
              subjectShort: 'InfoCompSc',
              subjectId: 'CICS',
              number: '305',
              topic: null,
              displayTitle: '305 Social Issues in Computing',
              title: 'Social Issues in Computing',
              titleLong:
                'College of Inform & Comp Sci 305 - Social Issues in Computing',
              description: null,
              hasTopics: false,
              corequisites: null,
              prerequisites: null,
              hasRestrictions: false,
              credits: '3'
            }
          }
        ]
      },
      {
        title: 'CNS Lab Science Courses',
        description:
          'Please see the section on Lab Science Courses at: https://www.cics.umass.edu/ugrad-education/ details-bs-requirements',
        requirements: [
          {
            requirementType: 'anonymous',
            designation: 'Lab Science'
          },
          {
            requirementType: 'anonymous',
            designation: 'Lab Science'
          }
        ]
      }
    ]
  };
}
