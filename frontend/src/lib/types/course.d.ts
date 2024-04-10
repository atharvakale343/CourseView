/*
  Example Course
  {
    "id": "COMPSCI|220",
    "subjectId": "COMPSCI",
    "number": "220",
    "title": "Programming Methodology",
    "titleLong": "Computer Science 220 - Programming Methodology",
    "displayTitle": "220 Programming Methodology",
    "credits": "4"
    "subjectLong": "Computer Science",
    "subjectShort": "CompSci",
    "topic": null,
    "description": null,
    "hasTopics": false,
    "corequisites": null,
    "prerequisites": null,
    "hasRestrictions": false,
  }
*/
type Course = {
  id: string;
  subjectId: string;
  number: string;
  title: string;
  displayTitle: string;
  credits: string;
  titleLong?: string | null;
  subjectLong?: string | null;
  subjectShort?: string | null;
  topic?: string | null;
  description?: string | null;
  hasTopics?: false | null;
  corequisites?: string | null;
  prerequisites?: string | null;
  hasRestrictions?: false | null;
};

type UserCourse = {
  course: Course;
  semester: string;
  grade?: string | null;
  professor?: string | null;
  notes?: string | null;
};
