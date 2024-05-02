/*
  Example Account
  {
    "id": number associated with user
    "email": "example@example.com"
    "gradSem": "Fall 2024",
    "majorCon": "Computer Science"
    "minorCon": "IT"
  }
*/

export type Account = {
    id: string;
    email: string;
    gradSem: string; 
    majors: string[];
    minors: string[];
}
