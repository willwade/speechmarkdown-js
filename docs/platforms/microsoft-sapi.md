# Microsoft Speech API (SAPI) voices

## Official resources

- [SAPI 5 XML reference](https://learn.microsoft.com/previous-versions/windows/desktop/ms720163(v=vs.85))

## Speech Markdown status

The library now includes a SAPI-specific formatter that converts Speech Markdown modifiers into SAPI-friendly SSML, including emitting `<emph>` for emphasis, mapping `say-as` values that Windows voices understand, and selecting voices via the `required="Name=…"` pattern expected by desktop engines.【F:src/formatters/FormatterFactory.ts†L1-L39】【F:src/formatters/MicrosoftSapiSsmlFormatter.ts†L6-L214】 Unsupported effects such as whispering or neural styles are ignored so the output remains valid for classic SAPI synthesizers.

## Voice catalogue

SAPI voice availability is determined by the voices installed on the host machine. Developers can enumerate the voices locally via PowerShell (`Get-SPVoice`) or .NET (`SpeechSynthesizer.GetInstalledVoices()`). Documenting the complete list in-repo is impractical because it varies by Windows SKU and third-party voice packs. When maintainers export the installed voices to JSON (for example `Get-InstalledVoices | ConvertTo-Json > voices.json`) and set `SAPI_VOICE_EXPORT` to that file, `npm run docs:update-voices` will regenerate `data/microsoft-sapi-voices.md` with the captured baseline.
