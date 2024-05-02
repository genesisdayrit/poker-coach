This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Prompt Templates

### General Template for Creating or Updating Features

```plaintext
I want to create or update a ______ (e.g., python script, my app, react component).

For the Frontend, I am using:
- Next.js with Typescript
- TailwindCSS

For the Backend, I am using:
***


What I want to do:
- X
- Y
- Z

Here is my file for X:
- [Link to File X or Description]

Here is my file for Y:
- [Link to File Y or Description]

Here is my file for Z:
- [Link to File Z or Description]

For example, I want to do this specific thing:

For this specific aspect, I want you to do X and Y:

Please clarify your understanding of the prompt before writing any code. Provide an outline of updates to be made, and I will approve. You can focus on the (frontend/backend) aspect for now. Let me know if you have any clarifying questions.
```

