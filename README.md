# sdlc_g8

# SDLC Starter Applications

This folder contains four independent React and Vite starter applications for the P13 software development exercise.

| Case | Application | Folder |
| --- | --- | --- |
| A | Campus Lost & Found | `apps/case-a-lost-found` |
| B | Campus Canteen Ordering | `apps/case-b-canteen-ordering` |
| C | Student Academic Work Coordination | `apps/case-c-academic-work` |
| D | Campus Equipment Access & Borrowing | `apps/case-d-equipment-borrowing` |

Each folder is a standalone project. To run one application:

```bash
cd apps/case-a-lost-found
npm install
npm run dev
```

Replace the folder name with the case you want to run. Each application stores demo changes in one browser `localStorage` key and includes a visible reset control. There is no backend and no data is shared between browsers or devices.
