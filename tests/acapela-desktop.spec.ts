import dedent from 'ts-dedent';
import { SpeechMarkdown } from '../src/SpeechMarkdown';

describe('Acapela Desktop - plain text', () => {
  const speech = new SpeechMarkdown();

  test('plain text passes through', () => {
    const result = speech.toSSML('Hello world', { platform: 'acapela' });
    expect(result).toBe('Hello world');
  });

  test('no speak tags', () => {
    const result = speech.toSSML('Hello world', { platform: 'acapela' });
    expect(result).not.toContain('<speak>');
    expect(result).not.toContain('</speak>');
  });
});

describe('Acapela Desktop - break-short', () => {
  const speech = new SpeechMarkdown();

  test('short break converts to pau tag', () => {
    const result = speech.toSSML('Hello [250ms] world', {
      platform: 'acapela',
    });
    expect(result).toBe('Hello \\pau=250\\ world');
  });

  test('second break converts to pau tag', () => {
    const result = speech.toSSML('Hello [3s] world', {
      platform: 'acapela',
    });
    expect(result).toBe('Hello \\pau=3000\\ world');
  });
});

describe('Acapela Desktop - break strength', () => {
  const speech = new SpeechMarkdown();

  test('weak break', () => {
    const result = speech.toSSML("Hello [break:'weak'] world", {
      platform: 'acapela',
    });
    expect(result).toBe('Hello \\pau=250\\ world');
  });

  test('strong break', () => {
    const result = speech.toSSML("Hello [break:'strong'] world", {
      platform: 'acapela',
    });
    expect(result).toBe('Hello \\pau=750\\ world');
  });

  test('medium break', () => {
    const result = speech.toSSML("Hello [break:'medium'] world", {
      platform: 'acapela',
    });
    expect(result).toBe('Hello \\pau=500\\ world');
  });
});

describe('Acapela Desktop - expressive tags', () => {
  const speech = new SpeechMarkdown();

  test('laugh maps to voice smiley', () => {
    const result = speech.toSSML('Hello [laugh] world', {
      platform: 'acapela',
    });
    expect(result).toContain('#LAUGH01#');
  });

  test('cough maps to voice smiley', () => {
    const result = speech.toSSML('Hello [cough] world', {
      platform: 'acapela',
    });
    expect(result).toContain('#COUGH01#');
  });

  test('sigh maps to breath smiley', () => {
    const result = speech.toSSML('Hello [sigh] world', {
      platform: 'acapela',
    });
    expect(result).toContain('#BREATH02#');
  });

  test('yawn maps to voice smiley', () => {
    const result = speech.toSSML('Hello [yawn]', { platform: 'acapela' });
    expect(result).toContain('#YAWN01#');
  });

  test('sneeze maps to voice smiley', () => {
    const result = speech.toSSML('Hello [sneeze]', { platform: 'acapela' });
    expect(result).toContain('#SNEEZE01#');
  });

  test('multiple expressive tags', () => {
    const result = speech.toSSML('Hello [laugh] how are you [sigh]', {
      platform: 'acapela',
    });
    expect(result).toContain('#LAUGH01#');
    expect(result).toContain('#BREATH02#');
  });

  test('gasp maps to breath smiley', () => {
    const result = speech.toSSML('[gasp]', { platform: 'acapela' });
    expect(result).toContain('#BREATH01#');
  });

  test('cry maps to cry smiley', () => {
    const result = speech.toSSML('[cry]', { platform: 'acapela' });
    expect(result).toContain('#CRY01#');
  });

  test('ahem maps to throat smiley', () => {
    const result = speech.toSSML('[ahem]', { platform: 'acapela' });
    expect(result).toContain('#THROAT01#');
  });

  test('throat-clear maps to throat smiley', () => {
    const result = speech.toSSML('[throat-clear]', { platform: 'acapela' });
    expect(result).toContain('#THROAT01#');
  });
});

describe('Acapela Desktop - rate modifier', () => {
  const speech = new SpeechMarkdown();

  test('rate fast', () => {
    const result = speech.toSSML('(hello)[rate:"fast"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rspd=150\\');
    expect(result).toContain('hello');
  });

  test('rate slow', () => {
    const result = speech.toSSML('(hello)[rate:"slow"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rspd=80\\');
    expect(result).toContain('hello');
  });

  test('rate with percentage', () => {
    const result = speech.toSSML('(hello)[rate:"+50%"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rspd=+50\\');
    expect(result).toContain('hello');
  });
});

describe('Acapela Desktop - pitch modifier', () => {
  const speech = new SpeechMarkdown();

  test('pitch high', () => {
    const result = speech.toSSML('(hello)[pitch:"high"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rpit=140\\');
    expect(result).toContain('hello');
  });

  test('pitch low', () => {
    const result = speech.toSSML('(hello)[pitch:"low"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rpit=75\\');
    expect(result).toContain('hello');
  });

  test('pitch with percentage', () => {
    const result = speech.toSSML('(hello)[pitch:"+10%"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\rpit=+10\\');
    expect(result).toContain('hello');
  });
});

describe('Acapela Desktop - volume modifier', () => {
  const speech = new SpeechMarkdown();

  test('volume loud', () => {
    const result = speech.toSSML('(hello)[volume:"loud"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\vol=49152\\');
    expect(result).toContain('hello');
  });

  test('volume soft', () => {
    const result = speech.toSSML('(hello)[volume:"soft"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\vol=24576\\');
    expect(result).toContain('hello');
  });
});

describe('Acapela Desktop - whisper modifier', () => {
  const speech = new SpeechMarkdown();

  test('whisper maps to volume and speed', () => {
    const result = speech.toSSML('(hello)[whisper]', { platform: 'acapela' });
    expect(result).toContain('\\vol=16384\\');
    expect(result).toContain('\\rspd=75\\');
    expect(result).toContain('hello');
  });
});

describe('Acapela Desktop - emphasis modifier', () => {
  const speech = new SpeechMarkdown();

  test('emphasis strong', () => {
    const result = speech.toSSML('(hello)[emphasis:"strong"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\emph\\');
    expect(result).toContain('hello');
  });

  test('emphasis none strips tag', () => {
    const result = speech.toSSML('(hello)[emphasis:"none"]', {
      platform: 'acapela',
    });
    expect(result).not.toContain('\\emph\\');
    expect(result).toContain('hello');
  });
});

describe('Acapela Desktop - short emphasis', () => {
  const speech = new SpeechMarkdown();

  test('+text+ becomes emph', () => {
    const result = speech.toSSML('Hello +world+', { platform: 'acapela' });
    expect(result).toContain('\\emph\\');
    expect(result).toContain('world');
  });

  test('~text~ strips emphasis', () => {
    const result = speech.toSSML('Hello ~world~', { platform: 'acapela' });
    expect(result).not.toContain('\\emph\\');
    expect(result).toContain('world');
  });
});

describe('Acapela Desktop - voice section', () => {
  const speech = new SpeechMarkdown();

  test('voice section produces vce tag', () => {
    const result = speech.toSSML('#[voice:"Ryan"] Hello world', {
      platform: 'acapela',
    });
    expect(result).toContain('\\vce=speaker=Ryan\\');
    expect(result).toContain('Hello world');
  });
});

describe('Acapela Desktop - sub modifier', () => {
  const speech = new SpeechMarkdown();

  test('sub replaces text with alias', () => {
    const result = speech.toSSML('(hello)[sub:"hi"]', { platform: 'acapela' });
    expect(result).toContain('hi');
  });
});

describe('Acapela Desktop - ipa', () => {
  const speech = new SpeechMarkdown();

  test('ipa produces prx tag', () => {
    const result = speech.toSSML('(hello)[ipa:"hɛloʊ"]', {
      platform: 'acapela',
    });
    expect(result).toContain('\\prx="hɛloʊ"\\');
  });
});

describe('Acapela Desktop - characters modifier', () => {
  const speech = new SpeechMarkdown();

  test('characters produces rms tag', () => {
    const result = speech.toSSML('(ABC)[characters]', { platform: 'acapela' });
    expect(result).toContain('\\rms=1\\');
    expect(result).toContain('ABC');
  });
});

describe('Acapela Desktop - audio stripped', () => {
  const speech = new SpeechMarkdown();

  test('audio tag is stripped', () => {
    const result = speech.toSSML("Hello !['http://example.com/audio.mp3']", {
      platform: 'acapela',
    });
    expect(result).toBe('Hello');
  });
});
