import { Section, Subject, Semester } from "@client/lib/types/Degree";
import { Course } from "@client/lib/types/course";
import sections from "./sections.json";
import subjects from "./subjects.json";
import courses_by_subject from "./courses_regblocks.json";

export class Spire {
    #allCourses: { subjectId: string; courses: Course[] }[];
    constructor() {
        this.#allCourses = courses_by_subject as {
            subjectId: string;
            courses: Course[];
        }[];
    }

    getArrConfigs(): Section[] {
        return sections as Section[];
    }

    getSubjects(): Subject[] {
        return subjects;
    }

    isValidSubjectId(subjectId: string): boolean {
        return this.getSubjects().some(subject => subject.id === subjectId);
    }

    getCoursesBySubjectId(subjectId: string): Course[] {
        return this.#allCourses.filter(json => json.subjectId === subjectId)[0]
            .courses;
    }

    getPastSemesterStrings(): Semester[] {
        const semesters: { display: string; value: string }[] = [];
        for (let i = 0; i < 10; i++) {
            const year = new Date().getFullYear() + 4 - i;
            semesters.push({ display: `Fall ${year}`, value: `fall-${year}` });
            semesters.push({
                display: `Summer ${year}`,
                value: `summer-${year}`,
            });
            semesters.push({
                display: `Spring ${year}`,
                value: `spring-${year}`,
            });
            semesters.push({
                display: `Winter ${year}`,
                value: `winter-${year}`,
            });
        }
        return semesters;
    }

    getGradeOptions(): string[] {
        return [
            "A",
            "A-",
            "B+",
            "B",
            "B-",
            "C+",
            "C",
            "C-",
            "D+",
            "D",
            "D-",
            "F",
        ];
    }
}
