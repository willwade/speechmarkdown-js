# Apple AVSpeechSynthesizer voices

## Official resources

- [AVSpeechSynthesizer documentation](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer)
- [SSML support overview](https://developer.apple.com/documentation/avfoundation/speech_synthesis)

## Speech Markdown status

Speech Markdown does not ship with an Apple-specific formatter. The FormatterFactory only exposes Amazon, Azure, Google, Samsung, and text emitters, so generating AVSpeechSynthesizer requests currently requires manual SSML or direct use of `AVSpeechUtterance` properties.【F:src/formatters/FormatterFactory.ts†L1-L39】 Adding native support would involve aligning Speech Markdown constructs with the limited subset of SSML that AVSpeechSynthesizer recognises (notably `phoneme`, `sub`, and pronunciation hints).

## Voice catalogue

macOS, iOS, and iPadOS ship a large number of built-in system voices that vary by OS version and user downloads. The helper script can create or refresh `data/apple-avspeechsynthesizer-voices.md` as a staging area for curated lists gathered from `AVSpeechSynthesisVoice.speechVoices()` output when maintainers have access to Apple hardware. Export the array to JSON (for example using a small Swift snippet) and set `APPLE_VOICE_EXPORT` before running `npm run docs:update-voices` to update the table.
