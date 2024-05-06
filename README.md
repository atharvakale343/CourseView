![example workflow](https://github.com/atharvakale343/CourseView/actions/workflows/node.js.yml/badge.svg)
![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=courseview-cs326-team-4)

# CourseView

A Course History and Planning Tool for students of UMass Amherst. This project is a part of the CS326 Web Programming course at UMass Amherst.

[Live Preview](https://app.courseview.us)

# Getting Started

This repository is organized into two main directories.

```
.
├── backend
└── frontend
```

# Cloning the Repo

```bash
git clone git@github.com:atharvakale343/326-final-project-spring-24.git
# this uses the rebase strategy when pulling, read more about it here: https://git-scm.com/docs/git-config#Documentation/git-config.txt-pullrebase
git config pull.rebase true
```

# Frontend

In your terminal, navigate to the `frontend` directory and run the following commands:

```bash
cd frontend
npm install
npm run dev
```

Read more about the frontend in the [frontend README](frontend/README.md).

# Backend

```bash
cd backend
npm install
npm run watch
```

Read more about the backend in the [backend README](backend/README.md).
