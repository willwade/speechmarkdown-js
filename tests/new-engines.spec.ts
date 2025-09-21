// tslint:disable-next-line:import-name
import dedent from 'ts-dedent';
import { SpeechMarkdown } from '../src/SpeechMarkdown';

describe('microsoft-sapi formatter', () => {
  const speech = new SpeechMarkdown();

  const markdown = dedent`
    SAPI (emphasis)[emphasis:"strong"] handles (letters)[characters] with (voice)[voice:'Zira'].
  `;

  test('renders SSML for Microsoft Speech API', () => {
    const options = {
      platform: 'microsoft-sapi',
    };
    const ssml = speech.toSSML(markdown, options);

    const expected = dedent`
      <speak>
      SAPI <emph level="strong">emphasis</emph> handles <say-as interpret-as="characters">letters</say-as> with <voice required="Name=Zira">voice</voice>.
      </speak>
    `;

    expect(ssml).toBe(expected);
  });
});

describe('apple-avspeechsynthesizer formatter', () => {
  const speech = new SpeechMarkdown();

  const markdown = dedent`
    Apple (A1)[characters] speaks (data)[ipa:"ˈdeɪtə"] with (Samantha)[voice:'Samantha'] voices.
  `;

  test('renders SSML for Apple AVSpeechSynthesizer', () => {
    const options = {
      platform: 'apple-avspeechsynthesizer',
    };
    const ssml = speech.toSSML(markdown, options);

    const expected = dedent`
      <speak>
      Apple <say-as interpret-as="characters">A1</say-as> speaks <phoneme alphabet="ipa" ph="ˈdeɪtə">data</phoneme> with <voice name="Samantha">Samantha</voice> voices.
      </speak>
    `;

    expect(ssml).toBe(expected);
  });
});

describe('ibm-watson formatter', () => {
  const speech = new SpeechMarkdown();

  const markdown = dedent`
    Watson (stress)[emphasis:"strong"] reads (100 km)[unit] with (style)[rate:"fast";pitch:"+2st";volume:"+3dB"] and (Allison)[voice:'Allison'] support.
  `;

  test('renders SSML for IBM Watson', () => {
    const options = {
      platform: 'ibm-watson',
    };
    const ssml = speech.toSSML(markdown, options);

    const expected = dedent`
      <speak>
      Watson <emphasis level="strong">stress</emphasis> reads <say-as interpret-as="unit">100 km</say-as> with <prosody rate="fast" pitch="+2st" volume="+3dB">style</prosody> and <voice name="Allison">Allison</voice> support.
      </speak>
    `;

    expect(ssml).toBe(expected);
  });
});
