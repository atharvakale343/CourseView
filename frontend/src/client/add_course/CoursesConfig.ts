import { Semester } from '../../lib/types/Degree';
import { Course } from '../../lib/types/course';
import { fetchBackendRoute } from '../BackendConfig';
import courses_regblocks from './courses_regblocks.json';
import faculty from './faculty-staff.json';

export function getSubjects() {
  return subjects;
}

export function getAllCoursesDropdown() {
  const json = courses_regblocks as { subjectId: string; courses: Course[] }[];
  return json;
}

export async function getPastSemesterStrings() {
  return fetchBackendRoute('/semesterStrings').then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch semester strings');
    }
    return response.json() as Promise<Semester[]>;
  });
}

export function getProfStrings(): string[] {
  return faculty;
}

export function getGradeOptions() {
  return ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
}

const subjects = [
  {
    id: 'ACCOUNTG',
    short: 'ACCOUNTG',
    long: 'Accounting',
    title: 'Accounting'
  },
  {
    id: 'AEROSPAC',
    short: 'AEROSPAC',
    long: 'Aerospace Studies',
    title: 'Aerospace Studies'
  },
  {
    id: 'AFROAM',
    short: 'AFROAM',
    long: 'Afro-American Studies',
    title: 'Afro-American Studies'
  },
  {
    id: 'ANIMLSCI',
    short: 'ANIMLSCI',
    long: 'Animal Science',
    title: 'Animal Science'
  },
  {
    id: 'ANTHRO',
    short: 'ANTHRO',
    long: 'Anthropology',
    title: 'Anthropology'
  },
  {
    id: 'ARABIC',
    short: 'ARABIC',
    long: 'Arabic',
    title: 'Arabic'
  },
  {
    id: 'ARCH',
    short: 'ARCH',
    long: 'Architecture',
    title: 'Architecture'
  },
  {
    id: 'ART',
    short: 'ART',
    long: 'Art',
    title: 'Art'
  },
  {
    id: 'ART-HIST',
    short: 'ART-HIST',
    long: 'Art History',
    title: 'Art History'
  },
  {
    id: 'ARTS-EXT',
    short: 'ARTS-EXT',
    long: 'Arts Extension',
    title: 'Arts Extension'
  },
  {
    id: 'ASIAN-ST',
    short: 'ASIAN-ST',
    long: 'Asian Studies',
    title: 'Asian Studies'
  },
  {
    id: 'ASTRON',
    short: 'ASTRON',
    long: 'Astronomy',
    title: 'Astronomy'
  },
  {
    id: 'BDIC',
    short: 'BDIC',
    long: "Bachelor's Deg. W/Indiv Conc.",
    title: "Bachelor's Deg. W/Indiv Conc."
  },
  {
    id: 'BIOCHEM',
    short: 'BIOCHEM',
    long: 'Biochemistry & Molecular Bio.',
    title: 'Biochemistry & Molecular Bio.'
  },
  {
    id: 'BIOLOGY',
    short: 'BIOLOGY',
    long: 'Biology',
    title: 'Biology'
  },
  {
    id: 'BMED-ENG',
    short: 'BMED-ENG',
    long: 'Biomedical Engineering',
    title: 'Biomedical Engineering'
  },
  {
    id: 'BIOSTATS',
    short: 'BIOSTATS',
    long: 'Biostatistics',
    title: 'Biostatistics'
  },
  {
    id: 'BCT',
    short: 'BCT',
    long: 'Building & Construction Tech',
    title: 'Building & Construction Tech'
  },
  {
    id: 'CATALAN',
    short: 'CATALAN',
    long: 'Catalan',
    title: 'Catalan'
  },
  {
    id: 'CHEM-ENG',
    short: 'CHEM-ENG',
    long: 'Chemical Engineering',
    title: 'Chemical Engineering'
  },
  {
    id: 'CHEM',
    short: 'CHEM',
    long: 'Chemistry',
    title: 'Chemistry'
  },
  {
    id: 'CHINESE',
    short: 'CHINESE',
    long: 'Chinese',
    title: 'Chinese'
  },
  {
    id: 'CE-ENGIN',
    short: 'CE-ENGIN',
    long: 'Civil & Environmental Engrg',
    title: 'Civil & Environmental Engrg'
  },
  {
    id: 'CLASSICS',
    short: 'CLASSICS',
    long: 'Classics',
    title: 'Classics'
  },
  {
    id: 'CICS',
    short: 'CICS',
    long: 'College of Inform & Comp Sci',
    title: 'College of Inform & Comp Sci'
  },
  {
    id: 'COMM',
    short: 'COMM',
    long: 'Communication',
    title: 'Communication'
  },
  {
    id: 'COMP-LIT',
    short: 'COMP-LIT',
    long: 'Comparative Literature',
    title: 'Comparative Literature'
  },
  {
    id: 'COMPSCI',
    short: 'COMPSCI',
    long: 'Computer Science',
    title: 'Computer Science'
  },
  {
    id: 'DANCE',
    short: 'DANCE',
    long: 'Dance',
    title: 'Dance'
  },
  {
    id: 'DACSS',
    short: 'DACSS',
    long: 'Data Analytics and Computation',
    title: 'Data Analytics and Computation'
  },
  {
    id: 'ECON',
    short: 'ECON',
    long: 'Economics',
    title: 'Economics'
  },
  {
    id: 'EDUC',
    short: 'EDUC',
    long: 'Education',
    title: 'Education'
  },
  {
    id: 'E&C-ENG',
    short: 'E&C-ENG',
    long: 'Electrical & Computer Engin',
    title: 'Electrical & Computer Engin'
  },
  {
    id: 'ENGIN',
    short: 'ENGIN',
    long: 'Engineering',
    title: 'Engineering'
  },
  {
    id: 'ENGLISH',
    short: 'ENGLISH',
    long: 'English',
    title: 'English'
  },
  {
    id: 'ESL',
    short: 'ESL',
    long: 'English as a Second Language',
    title: 'English as a Second Language'
  },
  {
    id: 'ENGLWRIT',
    short: 'ENGLWRIT',
    long: 'English Writing Program',
    title: 'English Writing Program'
  },
  {
    id: 'ECO',
    short: 'ECO',
    long: 'Environmental Conservation',
    title: 'Environmental Conservation'
  },
  {
    id: 'EHS',
    short: 'EHS',
    long: 'Environmental Health Sciences',
    title: 'Environmental Health Sciences'
  },
  {
    id: 'ENVIRSCI',
    short: 'ENVIRSCI',
    long: 'Environmental Science',
    title: 'Environmental Science'
  },
  {
    id: 'EPI',
    short: 'EPI',
    long: 'Epidemiology',
    title: 'Epidemiology'
  },
  {
    id: 'FILM-ST',
    short: 'FILM-ST',
    long: 'Film Studies',
    title: 'Film Studies'
  },
  {
    id: 'FINANCE',
    short: 'FINANCE',
    long: 'Finance',
    title: 'Finance'
  },
  {
    id: 'FYS',
    short: 'FYS',
    long: 'First Year Seminar',
    title: 'First Year Seminar'
  },
  {
    id: 'FORLANGC',
    short: 'FORLANGC',
    long: 'Five Coll Ctr: World Languages',
    title: 'Five Coll Ctr: World Languages'
  },
  {
    id: 'FOOD-SCI',
    short: 'FOOD-SCI',
    long: 'Food Science',
    title: 'Food Science'
  },
  {
    id: 'FRENCHST',
    short: 'FRENCHST',
    long: 'French Studies',
    title: 'French Studies'
  },
  {
    id: 'GEOGRAPH',
    short: 'GEOGRAPH',
    long: 'Geography',
    title: 'Geography'
  },
  {
    id: 'GEOLOGY',
    short: 'GEOLOGY',
    long: 'Geology',
    title: 'Geology'
  },
  {
    id: 'GEO-SCI',
    short: 'GEO-SCI',
    long: 'Geosciences',
    title: 'Geosciences'
  },
  {
    id: 'GERMAN',
    short: 'GERMAN',
    long: 'German',
    title: 'German'
  },
  {
    id: 'GRADSCH',
    short: 'GRADSCH',
    long: 'Graduate School',
    title: 'Graduate School'
  },
  {
    id: 'GREEK',
    short: 'GREEK',
    long: 'Greek',
    title: 'Greek'
  },
  {
    id: 'HPP',
    short: 'HPP',
    long: 'Health Promotion & Policy',
    title: 'Health Promotion & Policy'
  },
  {
    id: 'HEBREW',
    short: 'HEBREW',
    long: 'Hebrew',
    title: 'Hebrew'
  },
  {
    id: 'HISPAN',
    short: 'HISPAN',
    long: 'Hispanic Lit. & Linguistics',
    title: 'Hispanic Lit. & Linguistics'
  },
  {
    id: 'HISTORY',
    short: 'HISTORY',
    long: 'History',
    title: 'History'
  },
  {
    id: 'HONORS',
    short: 'HONORS',
    long: 'Honors College',
    title: 'Honors College'
  },
  {
    id: 'HT-MGT',
    short: 'HT-MGT',
    long: 'Hospitality & Tourism Managmnt',
    title: 'Hospitality & Tourism Managmnt'
  },
  {
    id: 'HUMANDEV',
    short: 'HUMANDEV',
    long: 'Human Development',
    title: 'Human Development'
  },
  {
    id: 'HM&FNART',
    short: 'HM&FNART',
    long: 'Humanities and Fine Arts',
    title: 'Humanities and Fine Arts'
  },
  {
    id: 'ICONS',
    short: 'ICONS',
    long: 'ICons',
    title: 'ICons'
  },
  {
    id: 'INFO',
    short: 'INFO',
    long: 'Informatics',
    title: 'Informatics'
  },
  {
    id: 'SCH-MGMT',
    short: 'SCH-MGMT',
    long: 'Isenberg School of Management',
    title: 'Isenberg School of Management'
  },
  {
    id: 'ITALIAN',
    short: 'ITALIAN',
    long: 'Italian Studies',
    title: 'Italian Studies'
  },
  {
    id: 'JAPANESE',
    short: 'JAPANESE',
    long: 'Japanese',
    title: 'Japanese'
  },
  {
    id: 'JOURNAL',
    short: 'JOURNAL',
    long: 'Journalism',
    title: 'Journalism'
  },
  {
    id: 'JUDAIC',
    short: 'JUDAIC',
    long: 'Judaic Studies',
    title: 'Judaic Studies'
  },
  {
    id: 'KIN',
    short: 'KIN',
    long: 'Kinesiology',
    title: 'Kinesiology'
  },
  {
    id: 'KOREAN',
    short: 'KOREAN',
    long: 'Korean',
    title: 'Korean'
  },
  {
    id: 'LABOR',
    short: 'LABOR',
    long: 'Labor Studies',
    title: 'Labor Studies'
  },
  {
    id: 'LANDARCH',
    short: 'LANDARCH',
    long: 'Landscape Architecture',
    title: 'Landscape Architecture'
  },
  {
    id: 'LANDCONT',
    short: 'LANDCONT',
    long: 'Landscape Contracting',
    title: 'Landscape Contracting'
  },
  {
    id: 'LLC',
    short: 'LLC',
    long: 'Languages, Literature&Culture',
    title: 'Languages, Literature&Culture'
  },
  {
    id: 'LATIN',
    short: 'LATIN',
    long: 'Latin',
    title: 'Latin'
  },
  {
    id: 'LATIN-ED',
    short: 'LATIN-ED',
    long: 'Latin-Student Teaching',
    title: 'Latin-Student Teaching'
  },
  {
    id: 'LEGAL',
    short: 'LEGAL',
    long: 'Legal Studies',
    title: 'Legal Studies'
  },
  {
    id: 'LINGUIST',
    short: 'LINGUIST',
    long: 'Linguistics',
    title: 'Linguistics'
  },
  {
    id: 'MANAGMNT',
    short: 'MANAGMNT',
    long: 'Management',
    title: 'Management'
  },
  {
    id: 'MARKETNG',
    short: 'MARKETNG',
    long: 'Marketing',
    title: 'Marketing'
  },
  {
    id: 'MS-ENG',
    short: 'MS-ENG',
    long: 'Materials Science and Engineer',
    title: 'Materials Science and Engineer'
  },
  {
    id: 'MATH',
    short: 'MATH',
    long: 'Mathematics',
    title: 'Mathematics'
  },
  {
    id: 'M&I-ENG',
    short: 'M&I-ENG',
    long: 'Mechanical & Industrial Engrg',
    title: 'Mechanical & Industrial Engrg'
  },
  {
    id: 'MICROBIO',
    short: 'MICROBIO',
    long: 'Microbiology',
    title: 'Microbiology'
  },
  {
    id: 'MIDEAST',
    short: 'MIDEAST',
    long: 'Middle Eastern Studies',
    title: 'Middle Eastern Studies'
  },
  {
    id: 'MILITARY',
    short: 'MILITARY',
    long: 'Military Leadership',
    title: 'Military Leadership'
  },
  {
    id: 'MOLCLBIO',
    short: 'MOLCLBIO',
    long: 'Molecular & Cellular Biology',
    title: 'Molecular & Cellular Biology'
  },
  {
    id: 'MUSIC',
    short: 'MUSIC',
    long: 'Music',
    title: 'Music'
  },
  {
    id: 'MUSIC-ED',
    short: 'MUSIC-ED',
    long: 'Music Education',
    title: 'Music Education'
  },
  {
    id: 'MUSICAPP',
    short: 'MUSICAPP',
    long: 'Music, Applied',
    title: 'Music, Applied'
  },
  {
    id: 'NRC',
    short: 'NRC',
    long: 'Natural Resources Conservation',
    title: 'Natural Resources Conservation'
  },
  {
    id: 'NATSCI',
    short: 'NATSCI',
    long: 'Natural Sciences',
    title: 'Natural Sciences'
  },
  {
    id: 'NEUROS&B',
    short: 'NEUROS&B',
    long: 'Neuroscience & Behavior',
    title: 'Neuroscience & Behavior'
  },
  {
    id: 'NURSING',
    short: 'NURSING',
    long: 'Nursing',
    title: 'Nursing'
  },
  {
    id: 'NUTRITN',
    short: 'NUTRITN',
    long: 'Nutrition',
    title: 'Nutrition'
  },
  {
    id: 'OIM',
    short: 'OIM',
    long: 'Operations & Info Management',
    title: 'Operations & Info Management'
  },
  {
    id: 'ORG&EVBI',
    short: 'ORG&EVBI',
    long: 'Organismic & Evolutionary Biol',
    title: 'Organismic & Evolutionary Biol'
  },
  {
    id: 'PHIL',
    short: 'PHIL',
    long: 'Philosophy',
    title: 'Philosophy'
  },
  {
    id: 'PHYSICS',
    short: 'PHYSICS',
    long: 'Physics',
    title: 'Physics'
  },
  {
    id: 'PLANTBIO',
    short: 'PLANTBIO',
    long: 'Plant Biology',
    title: 'Plant Biology'
  },
  {
    id: 'POLISH',
    short: 'POLISH',
    long: 'Polish',
    title: 'Polish'
  },
  {
    id: 'POLISCI',
    short: 'POLISCI',
    long: 'Political Science',
    title: 'Political Science'
  },
  {
    id: 'POLYMER',
    short: 'POLYMER',
    long: 'Polymer Science & Engineering',
    title: 'Polymer Science & Engineering'
  },
  {
    id: 'PORTUG',
    short: 'PORTUG',
    long: 'Portuguese',
    title: 'Portuguese'
  },
  {
    id: 'PSYCH',
    short: 'PSYCH',
    long: 'Psychological & Brain Sciences',
    title: 'Psychological & Brain Sciences'
  },
  {
    id: 'PUBHLTH',
    short: 'PUBHLTH',
    long: 'Public Health',
    title: 'Public Health'
  },
  {
    id: 'REGIONPL',
    short: 'REGIONPL',
    long: 'Regional Planning',
    title: 'Regional Planning'
  },
  {
    id: 'RES-ECON',
    short: 'RES-ECON',
    long: 'Resource Economics',
    title: 'Resource Economics'
  },
  {
    id: 'RUSSIAN',
    short: 'RUSSIAN',
    long: 'Russian',
    title: 'Russian'
  },
  {
    id: 'SPHHS',
    short: 'SPHHS',
    long: 'School of Pub Hlth & Hlth Sci',
    title: 'School of Pub Hlth & Hlth Sci'
  },
  {
    id: 'SPP',
    short: 'SPP',
    long: 'School of Public Policy',
    title: 'School of Public Policy'
  },
  {
    id: 'SCHPSYCH',
    short: 'SCHPSYCH',
    long: 'School Psychology',
    title: 'School Psychology'
  },
  {
    id: 'SRVCLRNG',
    short: 'SRVCLRNG',
    long: 'Service Learning',
    title: 'Service Learning'
  },
  {
    id: 'SOCBEHAV',
    short: 'SOCBEHAV',
    long: 'Social & Behavioral Science',
    title: 'Social & Behavioral Science'
  },
  {
    id: 'STPEC',
    short: 'STPEC',
    long: 'Social Thought & Polic. Econ',
    title: 'Social Thought & Polic. Econ'
  },
  {
    id: 'SOCIOL',
    short: 'SOCIOL',
    long: 'Sociology',
    title: 'Sociology'
  },
  {
    id: 'SPANISH',
    short: 'SPANISH',
    long: 'Spanish',
    title: 'Spanish'
  },
  {
    id: 'SLHS',
    short: 'SLHS',
    long: 'Speech, Language,& Hearing Sci',
    title: 'Speech, Language,& Hearing Sci'
  },
  {
    id: 'SPORTMGT',
    short: 'SPORTMGT',
    long: 'Sport Management',
    title: 'Sport Management'
  },
  {
    id: 'STATISTC',
    short: 'STATISTC',
    long: 'Statistics',
    title: 'Statistics'
  },
  {
    id: 'STOCKSCH',
    short: 'STOCKSCH',
    long: 'Stockbridge Sch of Agriculture',
    title: 'Stockbridge Sch of Agriculture'
  },
  {
    id: 'SUSTCOMM',
    short: 'SUSTCOMM',
    long: 'Sustainable Community',
    title: 'Sustainable Community'
  },
  {
    id: 'THEATER',
    short: 'THEATER',
    long: 'Theater',
    title: 'Theater'
  },
  {
    id: 'UMASS',
    short: 'UMASS',
    long: 'UMass Practicum',
    title: 'UMass Practicum'
  },
  {
    id: 'UNIVRSTY',
    short: 'UNIVRSTY',
    long: 'Univ Interdepartmental Course',
    title: 'Univ Interdepartmental Course'
  },
  {
    id: 'WGSS',
    short: 'WGSS',
    long: 'Women,Gender,Sexuality Studies',
    title: 'Women,Gender,Sexuality Studies'
  },
  {
    id: 'YIDDISH',
    short: 'YIDDISH',
    long: 'Yiddish',
    title: 'Yiddish'
  }
];
