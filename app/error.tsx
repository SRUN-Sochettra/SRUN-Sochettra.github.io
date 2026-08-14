
"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="status"><p className="eyebrow">Application error</p><h1>Something hit a boundary.</h1><p>The page ran into an unexpected error. Your next useful action is to retry.</p><button className="button" onClick={reset}>Try again</button></main>;
}
