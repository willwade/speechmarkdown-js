# Microsoft Speech API (SAPI) voices

## Official resources

- [SAPI 5 XML reference](https://learn.microsoft.com/previous-versions/windows/desktop/ms720163(v=vs.85))

## Speech Markdown status

Speech Markdown does not currently provide a dedicated SAPI formatter. The existing formatters target cloud SSML dialects (Amazon, Azure, Google, Samsung) and the plain text formatter, so Windows desktop scenarios must either rely on the generic Text formatter or craft SSML manually for SAPI consumers.【F:src/formatters/FormatterFactory.ts†L1-L39】 Implementing a SAPI formatter would require mapping Speech Markdown's modifiers onto the `<SPEAK>` XML schema and reconciling SAPI's unique phoneme, bookmark, and audio tag semantics.

## Voice catalogue

SAPI voice availability is determined by the voices installed on the host machine. Developers can enumerate the voices locally via PowerShell (`Get-SPVoice`) or .NET (`SpeechSynthesizer.GetInstalledVoices()`). Documenting the complete list in-repo is impractical because it varies by Windows SKU and third-party voice packs. When maintainers export the installed voices to JSON (for example `Get-InstalledVoices | ConvertTo-Json > voices.json`) and set `SAPI_VOICE_EXPORT` to that file, `npm run docs:update-voices` will regenerate `data/microsoft-sapi-voices.md` with the captured baseline.
