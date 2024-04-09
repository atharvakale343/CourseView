type Course = {
  courseSubjectId: string; // looks like "COMPSCI"
  courseNumber: string; // looks like "187"
  courseTitle: string; // looks like "Programming with Data Structures"
  courseDisplayTitle: string // looks like "220 Programming Methodology" (useful for search within a dropdown)
  credits: number; // looks like 4
  courseDescription?: string;
};

type UserCourse = {
  course: Course;
  semester: string;
  grade?: string;
  professor?: string;
  notes?: string;
};
