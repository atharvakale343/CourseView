# CourseView Backend - OpenAPI 3.0

> Version 1.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/loggedIn](#getloggedin) | Check if the user is logged in by checking if the connect.sid cookie is present and valid |
| POST | [/logout](#postlogout) | Log the user session out |
| POST | [/auth/one-tap/callback](#postauthone-tapcallback) | A callback endpoint for Google OAuth |
| POST | [/auth/basic/callback](#postauthbasiccallback) | A callback endpoint for Basic Authentication |
| GET | [/getAccountDetails](#getgetaccountdetails) | Gets the user related information to show in My Account |
| POST | [/saveAccountDetails](#postsaveaccountdetails) | Save the user related information shown in My Account |
| GET | [/arrConfigs](#getarrconfigs) | Returns an of all available ARR configs |
| GET | [/subjects](#getsubjects) | Returns an array of all subjects |
| GET | [/courses](#getcourses) | Returns an array of all courses for `subjectId` |
| GET | [/semesterStrings](#getsemesterstrings) | Returns an array of all semester strings objects |
| GET | [/gradeOptions](#getgradeoptions) | Returns an array of all grade options |
| GET | [/userCourse](#getusercourse) | Returns an array of user courses |
| POST | [/userCourse](#postusercourse) | Add a user course |
| DELETE | [/userCourse](#deleteusercourse) | Delete a user course |
| GET | [/userAssignment](#getuserassignment) | Returns an array of user course assignments |
| POST | [/userAssignment](#postuserassignment) | Add a user course assignment |
| PUT | [/userAssignment](#putuserassignment) | Put all user course assignments |
| DELETE | [/userAssignment](#deleteuserassignment) | Delete a user course assignment |
| PUT | [/userSelectedArrConfig](#putuserselectedarrconfig) | Save the user selected ARR Configs |
| GET | [/userSelectedArrConfig](#getuserselectedarrconfig) | Get the user selected ARR Configs |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| UserSelectedArrConfigs | [#/components/schemas/UserSelectedArrConfigs](#componentsschemasuserselectedarrconfigs) |  |
| DegreeRequirementAssignment | [#/components/schemas/DegreeRequirementAssignment](#componentsschemasdegreerequirementassignment) |  |
| UserCourse | [#/components/schemas/UserCourse](#componentsschemasusercourse) |  |
| Subject | [#/components/schemas/Subject](#componentsschemassubject) |  |
| Section | [#/components/schemas/Section](#componentsschemassection) |  |
| Subsection | [#/components/schemas/Subsection](#componentsschemassubsection) |  |
| FixedRequirement | [#/components/schemas/FixedRequirement](#componentsschemasfixedrequirement) |  |
| PrefixRequirement | [#/components/schemas/PrefixRequirement](#componentsschemasprefixrequirement) |  |
| AnonymousRequirement | [#/components/schemas/AnonymousRequirement](#componentsschemasanonymousrequirement) |  |
| Course | [#/components/schemas/Course](#componentsschemascourse) |  |
| Account | [#/components/schemas/Account](#componentsschemasaccount) |  |
| SuccessMessage | [#/components/schemas/SuccessMessage](#componentsschemassuccessmessage) |  |
| FailureMessage | [#/components/schemas/FailureMessage](#componentsschemasfailuremessage) |  |
| AuthSuccess | [#/components/schemas/AuthSuccess](#componentsschemasauthsuccess) |  |
| AuthFailure | [#/components/schemas/AuthFailure](#componentsschemasauthfailure) |  |
| UserAuth | [#/components/schemas/UserAuth](#componentsschemasuserauth) |  |
| cookieAuth | [#/components/securitySchemes/cookieAuth](#componentssecurityschemescookieauth) |  |

## Path Details

***

### [GET]/loggedIn

- Summary  
Check if the user is logged in by checking if the connect.sid cookie is present and valid

#### Responses

- 200 Returns an object with a message as "sucesss" or "fail"

`application/json`

```ts
{
  "oneOf": [
    {
      "$ref": "#/components/schemas/AuthSuccess"
    },
    {
      "$ref": "#/components/schemas/AuthFailure"
    }
  ]
}
```

***

### [POST]/logout

- Summary  
Log the user session out

#### Responses

- 200 success

`application/json`

```ts
{
  message?: string
}
```

***

### [POST]/auth/one-tap/callback

- Summary  
A callback endpoint for Google OAuth

#### RequestBody

- application/json

```ts
{
  credential?: string
}
```

#### Responses

- 200 The session ID is returned in a cookie named `connect.sid`. You need to include this cookie in subsequent requests.

`application/json`

```ts
{
  id?: string
  email?: string
  name?: string
}
```

***

### [POST]/auth/basic/callback

- Summary  
A callback endpoint for Basic Authentication

#### RequestBody

- application/json

```ts
{
  credential?: string
}
```

#### Responses

- 200 The session ID is returned in a cookie named `connect.sid`. You need to include this cookie in subsequent requests.

`application/json`

```ts
{
  id?: string
  email?: string
  name?: string
}
```

***

### [GET]/getAccountDetails

- Summary  
Gets the user related information to show in My Account

- Security  
cookieAuth  

#### Responses

- 200 Account info

`application/json`

```ts
{
  email?: string
  majors?: string[]
  gradSem?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [POST]/saveAccountDetails

- Summary  
Save the user related information shown in My Account

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  email?: string
  majors?: string[]
  gradSem?: string
}
```

#### Responses

- 200 Saved successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [GET]/arrConfigs

- Summary  
Returns an of all available ARR configs

#### Responses

- 200 An array of all available ARR configs

`application/json`

```ts
{
  id?: string
  title?: string
  description?: string
  subsections: {
    title?: string
    description?: string
    requirements?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement[]
  }[]
}[]
```

***

### [GET]/subjects

- Summary  
Returns an array of all subjects

#### Responses

- 200 array of all subjects

`application/json`

```ts
{
  id?: string
  short?: string
  long?: string
  title?: string
}[]
```

***

### [GET]/courses

- Summary  
Returns an array of all courses for `subjectId`

#### Parameters(Query)

```ts
subjectId: string
```

#### Responses

- 200 Returns an array of all courses for `subjectId`

`application/json`

```ts
{
  id?: string
  subjectId?: string
  number?: string
  title?: string
  displayTitle?: string
  credits?: string
  titleLong?: string
  subjectLong?: string
  subjectShort?: string
  topic?: string
  description?: string
  hasTopics?: boolean
  corequisites?: string
  prerequisites?: string
  hasRestrictions?: boolean
}[]
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [GET]/semesterStrings

- Summary  
Returns an array of all semester strings objects

#### Responses

- 200 an array of all semester strings

`application/json`

```ts
{
  display?: string
  value?: string
}[]
```

***

### [GET]/gradeOptions

- Summary  
Returns an array of all grade options

#### Responses

- 200 an array of grade options

`application/json`

```ts
string[]
```

***

### [GET]/userCourse

- Summary  
Returns an array of user courses

- Security  
cookieAuth  

#### Responses

- 200 an array of user courses

`application/json`

```ts
{
  course: {
    id?: string
    subjectId?: string
    number?: string
    title?: string
    displayTitle?: string
    credits?: string
    titleLong?: string
    subjectLong?: string
    subjectShort?: string
    topic?: string
    description?: string
    hasTopics?: boolean
    corequisites?: string
    prerequisites?: string
    hasRestrictions?: boolean
  }
  semester?: string
  transferred?: boolean
  grade?: string
  professor?: string
  notes?: string
  creditsAwarded?: string
}[]
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [POST]/userCourse

- Summary  
Add a user course

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  course: {
    id?: string
    subjectId?: string
    number?: string
    title?: string
    displayTitle?: string
    credits?: string
    titleLong?: string
    subjectLong?: string
    subjectShort?: string
    topic?: string
    description?: string
    hasTopics?: boolean
    corequisites?: string
    prerequisites?: string
    hasRestrictions?: boolean
  }
  semester?: string
  transferred?: boolean
  grade?: string
  professor?: string
  notes?: string
  creditsAwarded?: string
}
```

#### Responses

- 200 Added successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [DELETE]/userCourse

- Summary  
Delete a user course

- Security  
cookieAuth  

#### Parameters(Query)

```ts
courseId: string
```

#### Responses

- 200 Deleted successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [GET]/userAssignment

- Summary  
Returns an array of user course assignments

- Security  
cookieAuth  

#### Responses

- 200 an array of user course assignments

`application/json`

```ts
{
  status?: string
  id?: string
  requirement?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement
  userCourse: {
    course: {
      id?: string
      subjectId?: string
      number?: string
      title?: string
      displayTitle?: string
      credits?: string
      titleLong?: string
      subjectLong?: string
      subjectShort?: string
      topic?: string
      description?: string
      hasTopics?: boolean
      corequisites?: string
      prerequisites?: string
      hasRestrictions?: boolean
    }
    semester?: string
    transferred?: boolean
    grade?: string
    professor?: string
    notes?: string
    creditsAwarded?: string
  }
}[]
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [POST]/userAssignment

- Summary  
Add a user course assignment

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  status?: string
  id?: string
  requirement?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement
  userCourse: {
    course: {
      id?: string
      subjectId?: string
      number?: string
      title?: string
      displayTitle?: string
      credits?: string
      titleLong?: string
      subjectLong?: string
      subjectShort?: string
      topic?: string
      description?: string
      hasTopics?: boolean
      corequisites?: string
      prerequisites?: string
      hasRestrictions?: boolean
    }
    semester?: string
    transferred?: boolean
    grade?: string
    professor?: string
    notes?: string
    creditsAwarded?: string
  }
}
```

#### Responses

- 200 Added successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [PUT]/userAssignment

- Summary  
Put all user course assignments

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  status?: string
  id?: string
  requirement?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement
  userCourse: {
    course: {
      id?: string
      subjectId?: string
      number?: string
      title?: string
      displayTitle?: string
      credits?: string
      titleLong?: string
      subjectLong?: string
      subjectShort?: string
      topic?: string
      description?: string
      hasTopics?: boolean
      corequisites?: string
      prerequisites?: string
      hasRestrictions?: boolean
    }
    semester?: string
    transferred?: boolean
    grade?: string
    professor?: string
    notes?: string
    creditsAwarded?: string
  }
}[]
```

#### Responses

- 200 Added successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [DELETE]/userAssignment

- Summary  
Delete a user course assignment

- Security  
cookieAuth  

#### Parameters(Query)

```ts
assignmentId: string
```

#### Responses

- 200 Deleted successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [PUT]/userSelectedArrConfig

- Summary  
Save the user selected ARR Configs

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
string[]
```

#### Responses

- 200 Added successfully

`application/json`

```ts
{
  message?: string
}
```

- 400 Bad Request

`application/json`

```ts
{
  message?: string
  error?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

***

### [GET]/userSelectedArrConfig

- Summary  
Get the user selected ARR Configs

- Security  
cookieAuth  

#### Responses

- 200 Array of user selected ARR Config ids

`application/json`

```ts
string[]
```

- 401 Unauthorized

`application/json`

```ts
{
  message?: string
  error?: string
}
```

## References

### #/components/schemas/UserSelectedArrConfigs

```ts
string[]
```

### #/components/schemas/DegreeRequirementAssignment

```ts
{
  status?: string
  id?: string
  requirement?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement
  userCourse: {
    course: {
      id?: string
      subjectId?: string
      number?: string
      title?: string
      displayTitle?: string
      credits?: string
      titleLong?: string
      subjectLong?: string
      subjectShort?: string
      topic?: string
      description?: string
      hasTopics?: boolean
      corequisites?: string
      prerequisites?: string
      hasRestrictions?: boolean
    }
    semester?: string
    transferred?: boolean
    grade?: string
    professor?: string
    notes?: string
    creditsAwarded?: string
  }
}
```

### #/components/schemas/UserCourse

```ts
{
  course: {
    id?: string
    subjectId?: string
    number?: string
    title?: string
    displayTitle?: string
    credits?: string
    titleLong?: string
    subjectLong?: string
    subjectShort?: string
    topic?: string
    description?: string
    hasTopics?: boolean
    corequisites?: string
    prerequisites?: string
    hasRestrictions?: boolean
  }
  semester?: string
  transferred?: boolean
  grade?: string
  professor?: string
  notes?: string
  creditsAwarded?: string
}
```

### #/components/schemas/Subject

```ts
{
  id?: string
  short?: string
  long?: string
  title?: string
}
```

### #/components/schemas/Section

```ts
{
  id?: string
  title?: string
  description?: string
  subsections: {
    title?: string
    description?: string
    requirements?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement[]
  }[]
}
```

### #/components/schemas/Subsection

```ts
{
  title?: string
  description?: string
  requirements?: #/components/schemas/FixedRequirement | #/components/schemas/PrefixRequirement | #/components/schemas/AnonymousRequirement[]
}
```

### #/components/schemas/FixedRequirement

```ts
{
  requirementType?: string
  course: {
    id?: string
    subjectId?: string
    number?: string
    title?: string
    displayTitle?: string
    credits?: string
    titleLong?: string
    subjectLong?: string
    subjectShort?: string
    topic?: string
    description?: string
    hasTopics?: boolean
    corequisites?: string
    prerequisites?: string
    hasRestrictions?: boolean
  }
}
```

### #/components/schemas/PrefixRequirement

```ts
{
  requirementType?: string
  requirementId?: string
  subjectId?: string
  prefix?: string
  description?: string
  credits?: string
}
```

### #/components/schemas/AnonymousRequirement

```ts
{
  requirementType?: string
  designation?: string
  description?: string
  credits?: string
}
```

### #/components/schemas/Course

```ts
{
  id?: string
  subjectId?: string
  number?: string
  title?: string
  displayTitle?: string
  credits?: string
  titleLong?: string
  subjectLong?: string
  subjectShort?: string
  topic?: string
  description?: string
  hasTopics?: boolean
  corequisites?: string
  prerequisites?: string
  hasRestrictions?: boolean
}
```

### #/components/schemas/Account

```ts
{
  email?: string
  majors?: string[]
  gradSem?: string
}
```

### #/components/schemas/SuccessMessage

```ts
{
  message?: string
}
```

### #/components/schemas/FailureMessage

```ts
{
  message?: string
  error?: string
}
```

### #/components/schemas/AuthSuccess

```ts
{
  message?: string
  user: {
    id?: string
    email?: string
    name?: string
  }
}
```

### #/components/schemas/AuthFailure

```ts
{
  message?: string
}
```

### #/components/schemas/UserAuth

```ts
{
  id?: string
  email?: string
  name?: string
}
```

### #/components/securitySchemes/cookieAuth

```ts
{
  "type": "apiKey",
  "in": "cookie",
  "name": "connect.sid"
}
```