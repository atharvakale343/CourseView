/*
  Example Account
  {
    "id": number associated with user
    "username": "jwhite",
    "gradSem": "Fall 2024",
    "majorCon": "Computer Science"
    "secondDegree": null,
    "minorCon": "IT"
  }
*/

type Account = {
    id: string;
    email: string;
    gradSem: string; 
    majorCon: string | null;
    secondDegree: string | null;
    minorCon: string | null;
}