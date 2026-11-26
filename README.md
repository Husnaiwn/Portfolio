# Husnain's Portfolio

A static portfolio site deployed on Vercel, with a serverless NAIN AI assistant powered by Google Gemini.

## Run locally

Open the folder with a static server (VS Code Live Server). The chat needs Vercel Functions, so test it with the Vercel CLI (`vercel dev`).

## Enable NAIN AI

1. Create a key at Google AI Studio (aistudio.google.com/apikey).
2. In Vercel: Project -> Settings -> Environment Variables.
3. Add `GOOGLE_API_KEY` with the key, for Production, Preview and Development.
4. Optional: add `GEMINI_MODEL` to choose a model (default: `gemini-3.5-flash-lite`).
5. Redeploy. Variables only apply to new deployments.

Never put the key in HTML, JavaScript, GitHub or a public `.env` file. If a key is ever exposed, delete it in Google AI Studio and create a new one.

## Public files

Everything in this repository is public, including commit history. Do not commit keys, passwords or private documents.

## Contact

The contact form uses a `mailto:` link. It opens the visitor's email app and does not send mail directly.