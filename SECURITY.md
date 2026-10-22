# Security and publication boundaries

This portfolio is intended for public publication. No supported-release programme or response deadline is established here.

## Review priorities

- Treat all published content and NEXT_PUBLIC variables as public. Do not include private client data, credentials or unapproved screenshots.
- ProjectIndex interpolates project names into an innerHTML transition overlay. The current input is repository-authored data; review encoding before allowing untrusted content into that path.
- CaseNavigator reads and writes localStorage. Verify behaviour when storage is unavailable or blocked; stored panel coordinates are not authentication state.
- The case-study experiences illustrate systems. They do not establish the security, reliability or production status of the separate showcased applications.
- Dependency versions are declared, but no vulnerability scan was performed during this refresh. Review dependency and workflow changes before deployment.
- Local agent/MCP configuration is development tooling, not a requirement for running the public portfolio. Review tool permissions separately before enabling it.

Use a verified private maintainer channel for sensitive reports if available, or request one without publishing exploit details. No dedicated security address or enabled private-reporting feature was confirmed. Redact credentials, private records and tokens. These are static review observations, not executed exploits or a complete audit.
