# IBM Watson Text to Speech SSML

## Official resources

- [SSML documentation](https://cloud.ibm.com/apidocs/text-to-speech#synthesize)
- [Voice list](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices)

## Speech Markdown status

Speech Markdown lacks a Watson formatter today; only Amazon, Azure, Google, Samsung, and text outputs are wired into the formatter factory.【F:src/formatters/FormatterFactory.ts†L1-L39】 Integrating Watson support would require mapping modifiers to the service's `<express-as>`, `<voice-transformation>`, and custom pronunciation dictionaries while handling features unique to IBM's SSML dialect.

## Voice catalogue

Provide `WATSON_TTS_URL` (e.g. `https://api.us-south.text-to-speech.watson.cloud.ibm.com`) and `WATSON_TTS_API_KEY` to `npm run docs:update-voices` to refresh `data/ibm-watson-voices.md`. The script queries `/v1/voices` and writes a Markdown table that includes each voice's name, language, gender, and available expressive features so formatter validations can be cross-checked.
