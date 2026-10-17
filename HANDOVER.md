# HCI frontend — handover for backend

HCI (Hutt City Intelligence) is a React form workspace. Admins build and publish forms. Users fill them in. Charts can be built from those answers.

Repo: https://github.com/PavanDayanand/HCI

There is **no backend yet**. Nothing is saved to a server or to the browser’s storage APIs (`localStorage` / `sessionStorage`). All data lives in **React memory** for the current page session. **Refresh the tab, close the tab, or restart the app, and everything goes back to the starter sample.**

The UI is ready. It needs APIs so forms, answers, and analytics widgets persist.

---

## Run it

```bash
cd Hct-FE
npm install
npm run dev
```

Open http://localhost:5173

Use the **Admin / User** switch at the bottom of the sidebar. This is a demo toggle only. There is no login.

---

## What the app does today

### Admin — Form Builder (`/admin/forms`)

- List forms in **Active** and **Drafts**
- Create a form in SurveyJS Creator (`/admin/forms/new`)
- Edit a form (`/admin/forms/:formId/edit`)
- Save as draft or publish
- Unpublish (moves it back to draft)
- Preview, delete
- Upload a SurveyJS JSON file (saved as a draft)

A sample SurveyJS file sits at `forms/dog-registration.survey.json`. You can upload it from Form Builder.

**AI Builder** is a placeholder tab. PDF → form conversion is not implemented.

### Admin — Analytics (`/admin/analytics`)

Create a chart widget by picking:

- form name
- X axis (a question on that form)
- Y axis (count of submissions, or a number field)
- chart type: bar, pie, or line

Widgets only use submissions that exist in the current session.

### User — Forms (`/forms`)

- See published (active) forms
- Fill one (`/forms/:formId`)
- See submissions from this session

---

## How data is stored now

All of this is held in `src/forms/FormProvider.tsx` with `useState`.

On load you always get:

- one starter form: **Community feedback** (id `community-feedback`, status `active`)
- five sample submissions for that form
- no analytics widgets

Role (`admin` / `user`) is also only in memory. It resets to admin on refresh.

When you wire the API, replace those `useState` lists with fetch / save calls. The rest of the UI already reads from `useForms()`.

---

## Shapes the frontend already uses

These are the objects you will want to store.

**Form**

```ts
{
  id: string
  title: string
  description: string
  status: "draft" | "active"
  schema: object          // SurveyJS JSON
  updatedAt: string       // ISO date
}
```

**Submission**

```ts
{
  id: string
  formId: string
  formTitle: string
  answers: object         // SurveyJS answer map, e.g. { suburb: "Petone" }
  submittedAt: string     // ISO date
}
```

**Analytics widget**

```ts
{
  id: string
  formId: string
  xField: string          // question name
  yField: string          // "__count" or a number question name
  chartType: "bar" | "pie" | "line"
}
```

---

## What the backend needs to provide

A first pass that matches the current UI:

| Action | What the UI does now |
|---|---|
| List forms | Read `forms` from memory |
| Create / update form | `saveForm` |
| Publish / unpublish | Change `status` to `active` or `draft` |
| Delete form | Remove form + its widgets |
| List submissions | Read `submissions` |
| Submit a form | `addSubmission` |
| List / create / delete widgets | `widgets` / `addWidget` / `deleteWidget` |

Not built yet, but planned later:

- Real login and roles (instead of the sidebar switch)
- AI / PDF upload that creates a draft SurveyJS form

Auth, file storage, and validation are open — the frontend does not send tokens or call any URL today.

---

## Useful files

| File | Why |
|---|---|
| `src/forms/FormProvider.tsx` | All in-memory data and write functions |
| `src/types/form.ts` | Form, submission, and widget types |
| `src/App.tsx` | Routes |
| `src/pages/admin/FormEditorPage.tsx` | SurveyJS Creator (save draft / publish) |
| `src/pages/user/FillFormPage.tsx` | Survey fill + submit |
| `src/pages/admin/AnalyticsPage.tsx` | Widget create + charts |
| `forms/dog-registration.survey.json` | Example SurveyJS form |

Stack: React 19, Vite, TypeScript, MUI 9, React Router 7, SurveyJS 3.2.1.
