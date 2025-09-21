import { Formatter } from '../Interfaces';
import { SpeechOptions } from '../SpeechOptions';
import { TextFormatter } from './TextFormatter';
import { AmazonAlexaSsmlFormatter } from './AmazonAlexaSsmlFormatter';
import { AmazonPollySsmlFormatter } from './AmazonPollySsmlFormatter';
import { AmazonPollyNeuralSsmlFormatter } from './AmazonPollyNeuralSsmlFormatter';
import { GoogleAssistantSsmlFormatter } from './GoogleAssistantSsmlFormatter';
import { SamsungBixbySsmlFormatter } from './SamsungBixbySsmlFormatter';
import { MicrosoftAzureSsmlFormatter } from './MicrosoftAzureSsmlFormatter';
import { MicrosoftSapiSsmlFormatter } from './MicrosoftSapiSsmlFormatter';
import { AppleAvSpeechSynthesizerSsmlFormatter } from './AppleAvSpeechSynthesizerSsmlFormatter';
import { IbmWatsonSsmlFormatter } from './IbmWatsonSsmlFormatter';

export function createFormatter(options: SpeechOptions): Formatter {
  switch (options.platform) {
    case 'amazon-alexa':
      return new AmazonAlexaSsmlFormatter(options);
    case 'amazon-polly':
      return new AmazonPollySsmlFormatter(options);
    case 'amazon-polly-neural':
      return new AmazonPollyNeuralSsmlFormatter(options);
    case 'google-assistant':
      return new GoogleAssistantSsmlFormatter(options);
    case 'samsung-bixby':
      return new SamsungBixbySsmlFormatter(options);
    case 'microsoft-azure':
      return new MicrosoftAzureSsmlFormatter(options);
    case 'microsoft-sapi':
      return new MicrosoftSapiSsmlFormatter(options);
    case 'apple-avspeechsynthesizer':
      return new AppleAvSpeechSynthesizerSsmlFormatter(options);
    case 'ibm-watson':
      return new IbmWatsonSsmlFormatter(options);
    default:
      return new TextFormatter(options);
  }
}

export function createTextFormatter(options: SpeechOptions): Formatter {
  return new TextFormatter(options);
}
