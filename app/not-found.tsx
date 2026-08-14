
import Link from "next/link";
export default function NotFound() {
  return <main className="status"><p className="eyebrow">404</p><h1>This page isn't on the map.</h1><p>The page does not exist, or the project route has not been published.</p><Link className="button" href="/">Return home</Link></main>;
}
