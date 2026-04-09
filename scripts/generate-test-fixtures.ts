import * as fs from 'fs';
import * as path from 'path';

const SpeechMarkdown = require('../src/SpeechMarkdown').SpeechMarkdown;
const speech = new SpeechMarkdown();

const OUTPUT_DIR = path.join(
  __dirname,
  '..',
  '..',
  'speechmarkdown-test-files',
  'test-data',
);

const ALL_SSML_PLATFORMS = [
  'amazon-alexa',
  'amazon-polly',
  'amazon-polly-neural',
  'google-assistant',
  'microsoft-azure',
  'microsoft-sapi',
  'w3c',
  'samsung-bixby',
  'apple-avspeechsynthesizer',
  'ibm-watson',
  'elevenlabs',
  'acapela-cloud',
  'acapela',
];

const EXTENSION_MAP: Record<string, string> = {
  'amazon-alexa': 'alexa.ssml',
  'amazon-polly': 'polly.ssml',
  'amazon-polly-neural': 'polly-neural.ssml',
  'google-assistant': 'google.ssml',
  'microsoft-azure': 'azure.ssml',
  'microsoft-sapi': 'sapi.ssml',
  w3c: 'w3c.ssml',
  'samsung-bixby': 'samsung.ssml',
  'apple-avspeechsynthesizer': 'apple.ssml',
  'ibm-watson': 'watson.ssml',
  elevenlabs: 'elevenlabs.ssml',
  'acapela-cloud': 'acapela-cloud.ssml',
  acapela: 'acapela.ssml',
};

interface NewTestCase {
  name: string;
  input: string;
  platforms: string[] | 'all';
  options?: Record<string, any>;
}

const AZURE_ONLY = ['microsoft-azure'];
const ALL_PLATFORMS = [...ALL_SSML_PLATFORMS];

const NEW_TEST_CASES: NewTestCase[] = [
  // === Expressive tags - all platforms ===
  { name: 'expressive-laugh', input: 'Hello [laugh] world', platforms: 'all' },
  { name: 'expressive-cough', input: '[cough]', platforms: 'all' },
  { name: 'expressive-sigh', input: '[sigh]', platforms: 'all' },
  { name: 'expressive-yawn', input: '[yawn]', platforms: 'all' },
  { name: 'expressive-sneeze', input: '[sneeze]', platforms: 'all' },
  { name: 'expressive-gasp', input: '[gasp]', platforms: 'all' },
  { name: 'expressive-cry', input: '[cry]', platforms: 'all' },
  { name: 'expressive-ahem', input: '[ahem]', platforms: 'all' },
  {
    name: 'expressive-throat-clear',
    input: '[throat-clear]',
    platforms: 'all',
  },
  { name: 'expressive-whimper', input: '[whimper]', platforms: 'all' },
  { name: 'expressive-giggle', input: '[giggle]', platforms: 'all' },
  { name: 'expressive-hurray', input: '[hurray]', platforms: 'all' },
  { name: 'expressive-boo', input: '[boo]', platforms: 'all' },
  { name: 'expressive-applause', input: '[applause]', platforms: 'all' },
  {
    name: 'expressive-multiple',
    input: "Hello [laugh] how are you [sigh] I'm fine [cough]",
    platforms: 'all',
  },
  {
    name: 'expressive-with-break',
    input: 'Hello [laugh] wait [250ms] world',
    platforms: 'all',
  },

  // === Azure styles - Azure only ===
  {
    name: 'azure-style-cheerful',
    input: '(Hello)[cheerful]',
    platforms: AZURE_ONLY,
  },
  { name: 'azure-style-sad', input: '(Hello)[sad]', platforms: AZURE_ONLY },
  { name: 'azure-style-angry', input: '(Hello)[angry]', platforms: AZURE_ONLY },
  {
    name: 'azure-style-friendly',
    input: '(Hello)[friendly]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-style-excited',
    input: '(Hello)[excited]',
    platforms: AZURE_ONLY,
  },
  { name: 'azure-style-chat', input: '(Hello)[chat]', platforms: AZURE_ONLY },
  {
    name: 'azure-style-customerservice',
    input: '(Hello)[customerservice]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-style-narration-professional',
    input: '(Hello)[narration-professional]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-style-newscast-casual',
    input: '(Hello)[newscast-casual]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-style-with-degree',
    input: '(Hello)[cheerful:"1.5"]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-role-young-female',
    input: '(Hello)[style:"cheerful";role:"YoungAdultFemale"]',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-section-cheerful',
    input: '#[cheerful] Hello world',
    platforms: AZURE_ONLY,
  },
  {
    name: 'azure-section-sad',
    input: '#[sad] Hello world',
    platforms: AZURE_ONLY,
  },

  // === IPA short / bare IPA ===
  { name: 'ipa-short', input: '(speech)/spitʃ/', platforms: 'all' },
  { name: 'bare-ipa', input: 'say /spitʃ/ now', platforms: 'all' },
  { name: 'sub-short', input: '(aluminium){aluminum}', platforms: 'all' },

  // === Mark tag ===
  {
    name: 'mark-standard',
    input: '[mark:"mark1"] Hello world',
    platforms: 'all',
  },

  // === Cardinal, digits ===
  { name: 'cardinal-standard', input: '(123)[cardinal]', platforms: 'all' },
  { name: 'digits-standard', input: '(123)[digits]', platforms: 'all' },

  // === Escape XML ===
  {
    name: 'escape-xml-characters',
    input: '1 < 2 & 3 > 0 "yes" \'no\'',
    platforms: 'all',
  },

  // === Timbre, DRC ===
  { name: 'timbre-standard', input: '(text)[timbre:"+10%"]', platforms: 'all' },
  { name: 'drc-standard', input: '(text)[drc]', platforms: 'all' },

  // === Voice display name ===
  {
    name: 'voice-azure-displayname',
    input: '(text)[voice:"Jenny"]',
    platforms: 'all',
  },
];

function readExistingSmd(dirName: string): string | null {
  const dirPath = path.join(OUTPUT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return null;
  const smdPath = path.join(dirPath, `${dirName}.smd`);
  if (!fs.existsSync(smdPath)) return null;
  return fs.readFileSync(smdPath, 'utf-8').replace(/\n$/, '');
}

function generatePlatformFile(
  dirName: string,
  input: string,
  platform: string,
  extension: string,
  options?: Record<string, any>,
): boolean {
  const dirPath = path.join(OUTPUT_DIR, dirName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${dirName}.${extension}`);
  if (fs.existsSync(filePath)) {
    return false;
  }

  try {
    let output: string;
    if (platform === 'text') {
      output = speech.toText(input);
    } else {
      const opts: any = { platform, includeSpeakTag: true, ...(options || {}) };
      output = speech.toSSML(input, opts);
    }
    fs.writeFileSync(filePath, output.endsWith('\n') ? output : output + '\n');
    return true;
  } catch (e: any) {
    console.error(`  ERROR: ${dirName} / ${extension}: ${e.message || e}`);
    return false;
  }
}

function generate() {
  let generated = 0;
  let skipped = 0;
  let existing = 0;

  // Step 1: For ALL existing test cases, add missing platform files
  const existingDirs = fs.readdirSync(OUTPUT_DIR).filter((d) => {
    return fs.statSync(path.join(OUTPUT_DIR, d)).isDirectory;
  });

  const dirs = fs.readdirSync(OUTPUT_DIR);
  for (const dirName of dirs) {
    const dirPath = path.join(OUTPUT_DIR, dirName);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const input = readExistingSmd(dirName);
    if (!input) continue;

    // Determine if this is an Azure-specific test
    const isAzureSpecific =
      dirName.startsWith('azure-') && !dirName.includes('voice');
    const platforms = isAzureSpecific ? AZURE_ONLY : ALL_PLATFORMS;

    for (const platform of platforms) {
      const extension = EXTENSION_MAP[platform];
      if (!extension) continue;
      const done = generatePlatformFile(dirName, input, platform, extension);
      if (done) generated++;
      else existing++;
    }

    // Always generate text output if missing
    const txtDone = generatePlatformFile(dirName, input, 'text', 'txt');
    if (txtDone) generated++;
    else existing++;
  }

  // Step 2: Create NEW test cases that don't exist yet
  for (const tc of NEW_TEST_CASES) {
    const existing = readExistingSmd(tc.name);
    if (existing) {
      continue; // Skip if this test case already exists
    }

    const dirPath = path.join(OUTPUT_DIR, tc.name);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write .smd file
    const smdPath = path.join(dirPath, `${tc.name}.smd`);
    fs.writeFileSync(smdPath, tc.input + '\n');

    // Generate text
    generatePlatformFile(tc.name, tc.input, 'text', 'txt', tc.options);

    // Generate SSML for specified platforms
    const platforms = tc.platforms === 'all' ? ALL_PLATFORMS : tc.platforms;
    for (const platform of platforms) {
      const extension = EXTENSION_MAP[platform];
      if (!extension) continue;
      generatePlatformFile(tc.name, tc.input, platform, extension, tc.options);
    }
    generated += platforms.length + 2; // platforms + smd + txt
  }

  console.log(`\nGenerated ${generated} new files`);
  console.log(`Skipped ${existing} already existing files`);
}

generate();
