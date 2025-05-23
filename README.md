# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# Intro

Finally, a decent app for my grades (today is 22 May, on the 10th of June I finish school - so it's a little late... but still it's cool).

PS: The icon was generated with `npx pwa-asset-generator ./src/app/icon.png ./public/icons --icon-only -p 20% -b '#4941A2'` and `https://ray.so/lTvv7Tl`

## Features

- **Fetch Grades & Absences:** Retrieves grades and absences from the school's API.
- **Subject Summaries:** Displays a summary card for each subject, showing average score, all grades, and unmotivated absences.
- **Responsive Design:** Uses a drawer on mobile and a side sheet on desktop for detailed subject views.
- **Modern UI:** Styled with Tailwind CSS, Radix UI components, and the Roboto font.
- **Theme Support:** Light/dark mode toggle.
- **Page Refresh:** Manual refresh control for up-to-date data.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development

Start the development server:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Build

To build for production:

```sh
npm run build
npm start
```

## Project Structure

- page.tsx: Main page, data fetching, and layout.
- subject-summary-card.tsx: Subject summary card UI and logic.
- api-grades.ts: Grades API integration.
- api-subjects.ts: Subjects API integration.
- layout.tsx: Global layout, theme provider, and font setup.
- globals.css: Global and theme styles.

## Style Guide

- **Primary color:** Indigo (#3F51B5)
- **Secondary color:** Pink (#E91E63)
- **Background:** Grey 50 (#FAFAFA)
- **Font:** Roboto

## Customization

- Update API keys and endpoints in api-grades.ts and api-subjects.ts as needed.
- Adjust theme variables in globals.css.

## License

*(Add license information here if applicable)*

---

For more details, see blueprint.md.