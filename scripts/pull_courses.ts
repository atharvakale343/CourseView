import "dotenv/config"
import FileSystem from "fs"
import util from "util"

const cookie_name = process.env.SCHEDULE_BUILDER_COOKIE_NAME
const cookie_value = process.env.SCHEDULE_BUILDER_COOKIE_VALUE

const base_url = "https://umass.collegescheduler.com"

type Subject = {
  id: string
  short: string
  long: string
  title: string
}

type Course = {
  id: string
  subjectLong: string
  subjectShort: string
  subjectId: string
  number: string
  displayTitle: string
  title: string
  titleLong: string
}

type Regblocks = {
  registrationBlocks: []
  sections: {
    creditsMax: number
    creditsMin: number
    credits: string
  }[]
}

const options = {
  headers: {
    DNT: "1",
    Referer: "https://umass.collegescheduler.com/terms/Fall%202024/courses/add",
    Cookie: `${cookie_name}=${cookie_value}`,
  },
}

async function get_subjects(): Promise<Subject[]> {
  const slug = "/api/terms/Fall%202024/subjects"
  const url = base_url + slug

  return fetch(url, options).then((response: any) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as unknown as Subject[]
  })
}

async function get_courses(subjectId: string): Promise<Course[]> {
  const slug = `/api/terms/Fall%202024/subjects/${subjectId}/courses`
  const url = base_url + slug

  return fetch(url, options).then((response: any) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as unknown as Course[]
  })
}

async function get_course_regblocks(subjectId: string, courseNumber: string): Promise<Regblocks> {
  const slug = `/api/terms/Fall%202024/subjects/${subjectId}/courses/${courseNumber}/regblocks`
  const url = base_url + slug

  return fetch(url, options).then((response: any) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as unknown as Regblocks
  })
}

type CoursesJSON = { subjectId: string; courses: Course[] }[]

async function write_to_json_file(data: any, file_name: string) {
  FileSystem.writeFileSync(file_name, JSON.stringify(data, null, 2))
}

async function read_json_from_file(file_name: string) {
  return JSON.parse(FileSystem.readFileSync(file_name, "utf8"))
}

if (process.argv.length < 3) {
  console.log(
    "Usage: npm run start <subjects | courses [subjectId] | course-regblocks [subjectId] [courseId]",
  )
  process.exit(1)
}

const command = process.argv[2]

if (command === "subjects") {
  get_subjects().then(subjects => {
    console.log("Number of subjects: ", subjects.length)
    write_to_json_file(subjects, "subjects.json")
  })
} else if (command === "courses") {
  if (process.argv.length === 3) {
    // get all courses
    const subjects = (await read_json_from_file("subjects.json")) as Subject[]
    const coursesData = await Promise.all(
      subjects.map(subject =>
        get_courses(subject.id).then(courses => ({ subjectId: subject.id, courses: courses })),
      ),
    )
    console.log(
      "Number of courses: ",
      coursesData.reduce((acc, subjectData) => acc + subjectData.courses.length, 0),
    )
    write_to_json_file(coursesData, "courses.json")
  } else if (process.argv.length === 4) {
    // get courses for a specific subject
    const subjectId = process.argv[3]
    const coursesData = await Promise.all(
      [{ id: subjectId }].map(subject =>
        get_courses(subject.id).then(courses => ({ subjectId: subject.id, courses: courses })),
      ),
    )
    console.log("Number of courses: ", coursesData[0].courses.length)
    write_to_json_file(coursesData, "courses.json")
  } else {
    console.log("Usage: npm run start courses [subjectId]")
    process.exit(1)
  }
} else if (command === "course-regblocks") {
  let coursesData
  if (process.argv.length === 3) {
    // get all regblocks for all courses
    coursesData = (await read_json_from_file("courses.json")) as CoursesJSON
  } else if (process.argv.length === 5) {
    // get all regblocks for specific subjectId and courseId
    const subjectId = process.argv[3]
    const courseId = process.argv[4]
    coursesData = (await read_json_from_file("courses.json")) as CoursesJSON
    coursesData = coursesData.filter(subjectData => subjectData.subjectId === subjectId)
    coursesData = coursesData.map(subjectData => {
      subjectData.courses = subjectData.courses.filter(course => course.number === courseId)
      return subjectData
    })
  } else {
    console.log("Usage: npm run start course-regblocks [subjectId courseId]")
    process.exit(1)
  }
  const courses_regblocks = await Promise.all(
    coursesData.map(async subjectData =>
      Promise.all(
        subjectData.courses.map(async courseData => {
          return get_course_regblocks(subjectData.subjectId, courseData.number).then(regblocks => {
            const newCourseData: Course & { credits: string } = { ...courseData, credits: "" }
            if (regblocks.sections.length > 0) {
              newCourseData.credits = regblocks.sections[0].credits
            }
            return newCourseData
          })
        }),
      ).then(courses => ({ subjectId: subjectData.subjectId, courses: courses })),
    ),
  )
  write_to_json_file(courses_regblocks, "courses_regblocks.json")
} else {
  console.log("Invalid command")
  process.exit(1)
}
