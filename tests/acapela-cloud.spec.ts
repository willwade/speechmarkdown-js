import dedent from 'ts-dedent';
import { SpeechMarkdown } from '../src/SpeechMarkdown';

describe('Acapela Cloud - break-short', () => {
  const speech = new SpeechMarkdown();

  const markdown = 'Sample [3s] speech [250ms] markdown';

  test('converts to SSML with breaks', () => {
    const options = { platform: 'acapela-cloud' };
    const ssml = speech.toSSML(markdown, options);

    const expected = dedent`
      <speak>
      Sample <break time="3s"/> speech <break time="250ms"/> markdown
      </speak>
    `;
    expect(ssml).toBe(expected);
  });
});

describe('Acapela Cloud - expressive tags', () => {
  const speech = new SpeechMarkdown();

  test('laugh maps to voice smiley', () => {
    const ssml = speech.toSSML('Hello [laugh] world', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#LAUGH01#');
  });

  test('cough maps to voice smiley', () => {
    const ssml = speech.toSSML('Hello [cough] world', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#COUGH01#');
  });

  test('sigh maps to breath voice smiley', () => {
    const ssml = speech.toSSML('Hello [sigh] world', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#BREATH02#');
  });

  test('yawn maps to voice smiley', () => {
    const ssml = speech.toSSML('Hello [yawn] world', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#YAWN01#');
  });

  test('sneeze maps to voice smiley', () => {
    const ssml = speech.toSSML('Hello [sneeze]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#SNEEZE01#');
  });

  test('multiple expressive tags', () => {
    const ssml = speech.toSSML('Hello [laugh] how are you [sigh]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('#LAUGH01#');
    expect(ssml).toContain('#BREATH02#');
  });
});

describe('Acapela Cloud - emphasis', () => {
  const speech = new SpeechMarkdown();

  test('short emphasis moderate', () => {
    const ssml = speech.toSSML('Hello +world+', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('world');
  });
});

describe('Acapela Cloud - text modifiers', () => {
  const speech = new SpeechMarkdown();

  test('rate modifier', () => {
    const ssml = speech.toSSML('(hello)[rate:"fast"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('hello');
    expect(ssml).toContain('prosody');
    expect(ssml).toContain('fast');
  });

  test('pitch modifier', () => {
    const ssml = speech.toSSML('(hello)[pitch:"high"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('hello');
    expect(ssml).toContain('prosody');
    expect(ssml).toContain('high');
  });

  test('volume modifier', () => {
    const ssml = speech.toSSML('(hello)[volume:"loud"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('hello');
    expect(ssml).toContain('prosody');
    expect(ssml).toContain('loud');
  });

  test('whisper modifier', () => {
    const ssml = speech.toSSML('(hello)[whisper]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('hello');
    expect(ssml).toContain('prosody');
  });

  test('emphasis modifier', () => {
    const ssml = speech.toSSML('(hello)[emphasis:"strong"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('hello');
    expect(ssml).toContain('emphasis');
  });

  test('sub modifier', () => {
    const ssml = speech.toSSML('(hello)[sub:"hi"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('<sub alias="hi">hello</sub>');
  });

  test('ipa modifier', () => {
    const ssml = speech.toSSML('(hello)[ipa:"hɛloʊ"]', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('phoneme');
    expect(ssml).toContain('hɛloʊ');
  });
});

describe('Acapela Cloud - sections', () => {
  const speech = new SpeechMarkdown();

  test('voice section', () => {
    const ssml = speech.toSSML('#[voice:"Ryan"] Hello world', {
      platform: 'acapela-cloud',
    });
    expect(ssml).toContain('voice');
    expect(ssml).toContain('Ryan');
    expect(ssml).toContain('Hello world');
  });
});

describe('Acapela Cloud - no speak tag', () => {
  const speech = new SpeechMarkdown();

  test('without includeSpeakTag', () => {
    const ssml = speech.toSSML('Hello world', {
      platform: 'acapela-cloud',
      includeSpeakTag: false,
    });
    expect(ssml).not.toContain('<speak>');
    expect(ssml).toContain('Hello world');
  });
});
