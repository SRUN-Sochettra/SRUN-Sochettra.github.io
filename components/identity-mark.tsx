
type IdentityMarkProps = { className?: string };

export default function IdentityMark({ className = "" }: IdentityMarkProps) {
  return (
    <h1 className={`identity-mark ${className}`.trim()} aria-label="Srun Sochettra — Systems in Motion">
      <span className="identity-mark__name" aria-hidden="true">
        <span className="identity-mark__letter identity-mark__letter--s">S</span>
        <span className="identity-mark__letter identity-mark__letter--r">R</span>
        <span className="identity-mark__letter identity-mark__letter--u">U</span>
        <span className="identity-mark__letter identity-mark__letter--n">N</span>
      </span>
      <span className="identity-mark__descriptor" aria-hidden="true">Systems in Motion</span>
    </h1>
  );
}
