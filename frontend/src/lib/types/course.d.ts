type Course = {
  courseSubjectId: string; // looks like "COMPSCI"
  courseNumber: string; // looks like "187"
  courseTitle: string; // looks like "Programming with Data Structures"
  courseDescription: string;
  credits: number; // looks like 4
};

type UserCourse = {
  course: Course;
  semester: string;
  professor: string;
  grade: string;
  notes: string;
};
