import { SpeechOptions } from '../SpeechOptions';
import { FormatterBase } from './FormatterBase';
import { EXPRESSIVE_TO_VOICE_SMILEY } from './data/acapelaVoiceSmileys';

const RATE_MAP: Record<string, string> = {
  'x-slow': '60',
  slow: '80',
  medium: '100',
  fast: '150',
  'x-fast': '200',
  default: '100',
};

const PITCH_MAP: Record<string, string> = {
  'x-low': '60',
  low: '75',
  medium: '100',
  high: '140',
  'x-high': '180',
  default: '100',
};

const VOLUME_MAP: Record<string, string> = {
  silent: '0',
  'x-soft': '16384',
  soft: '24576',
  medium: '32768',
  loud: '49152',
  'x-loud': '65535',
  default: '65535',
};

export class AcapelaDesktopFormatter extends FormatterBase {
  constructor(public options: SpeechOptions) {
    super(options);
  }

  public format(ast: any): string {
    const lines = this.formatFromAst(ast, []);
    let txt = lines.join('').trim();
    txt = txt.replace(/  +/g, ' ');
    return txt;
  }

  private parsePercentValue(value: string): string | null {
    const match = value.match(/^([+-]?\d+)%$/);
    if (match) {
      return match[1];
    }
    return null;
  }

  private mapRate(value: string): string {
    const pct = this.parsePercentValue(value);
    if (pct !== null) {
      return pct;
    }
    const lower = value.toLowerCase();
    return RATE_MAP[lower] || RATE_MAP.default;
  }

  private mapPitch(value: string): string {
    const pct = this.parsePercentValue(value);
    if (pct !== null) {
      return pct;
    }
    const lower = value.toLowerCase();
    return PITCH_MAP[lower] || PITCH_MAP.default;
  }

  private mapVolume(value: string): string {
    const pct = this.parsePercentValue(value);
    if (pct !== null) {
      const base = 65535;
      const pctNum = parseInt(pct, 10);
      return Math.round((base * pctNum) / 100).toString();
    }
    const lower = value.toLowerCase();
    return VOLUME_MAP[lower] || VOLUME_MAP.default;
  }

  private processTextModifier(ast: any, lines: string[]): string[] {
    let text = '';
    const tags: string[] = [];

    for (const child of ast.children) {
      switch (child.name) {
        case 'plainText':
        case 'plainTextSpecialChars':
        case 'plainTextEmphasis':
        case 'plainTextPhone':
        case 'plainTextModifier':
          text = child.allText;
          break;
        case 'textModifierKeyOptionalValue': {
          let key = child.children[0].allText;
          key =
            {
              chars: 'characters',
              cardinal: 'number',
              digits: 'characters',
              bleep: 'expletive',
              phone: 'telephone',
              vol: 'volume',
            }[key] || key;
          const value =
            child.children.length === 2 ? child.children[1].allText : '';

          switch (key) {
            case 'rate': {
              const rspd = this.mapRate(value || 'medium');
              tags.push(`\\rspd=${rspd}\\`);
              break;
            }
            case 'pitch': {
              const rpit = this.mapPitch(value || 'medium');
              tags.push(`\\rpit=${rpit}\\`);
              break;
            }
            case 'volume': {
              const vol = this.mapVolume(value || 'default');
              tags.push(`\\vol=${vol}\\`);
              break;
            }
            case 'emphasis':
              if (value !== 'none' && value !== 'reduced') {
                tags.push('\\emph\\');
              }
              break;
            case 'whisper':
              tags.push('\\vol=16384\\');
              tags.push('\\rspd=75\\');
              break;
            case 'voice':
              if (value) {
                tags.push(`\\vce=speaker=${value}\\`);
              }
              break;
            case 'ipa':
              if (value) {
                tags.push(`\\prx="${value}"\\`);
              }
              break;
            case 'sub':
              if (value) {
                text = value;
              }
              break;
            case 'characters':
            case 'digits':
              tags.push('\\rms=1\\');
              break;
            default:
              break;
          }
          break;
        }
      }
    }

    if (tags.length > 0) {
      lines.push(...tags);
    }
    if (text) {
      lines.push(text);
    }
    return lines;
  }

  protected formatFromAst(ast: any, lines: string[] = []): string[] {
    switch (ast.name) {
      case 'document': {
        this.processAst(ast.children, lines);
        return lines;
      }
      case 'paragraph': {
        this.processAst(ast.children, lines);
        return lines;
      }
      case 'simpleLine': {
        this.processAst(ast.children, lines);
        return lines;
      }
      case 'lineEnd': {
        lines.push(ast.allText);
        return lines;
      }
      case 'emptyLine': {
        if (this.options.preserveEmptyLines) {
          lines.push(ast.allText);
        }
        return lines;
      }
      case 'plainText':
      case 'plainTextSpecialChars':
      case 'plainTextEmphasis':
      case 'plainTextPhone':
      case 'plainTextModifier': {
        lines.push(ast.allText);
        return lines;
      }
      case 'shortBreak': {
        const time = ast.children[0].allText;
        const ms = this.timeToMilliseconds(time);
        lines.push(`\\pau=${ms}\\`);
        return lines;
      }
      case 'break': {
        const val = ast.children[0].allText;
        const nodeType = ast.children[0].children[0].name;

        if (nodeType === 'time') {
          const ms = this.timeToMilliseconds(val);
          lines.push(`\\pau=${ms}\\`);
        } else {
          const ms = this.strengthToMs(val);
          lines.push(`\\pau=${ms}\\`);
        }
        return lines;
      }
      case 'expressive': {
        const value = ast.children[0].allText;
        const smiley = EXPRESSIVE_TO_VOICE_SMILEY[value];
        if (smiley) {
          lines.push(smiley);
        }
        return lines;
      }
      case 'shortIpa': {
        const textNode = ast.children?.find(
          (child: any) =>
            child &&
            (child.name === 'parenthesized' ||
              child.name === 'plainTextModifier'),
        );
        const text =
          textNode && textNode.name === 'parenthesized'
            ? this.extractParenthesizedText(textNode)
            : textNode?.allText || '';
        const phonemeNode = ast.children?.find(
          (child: any) => child && child.name === 'shortIpaValue',
        );
        const phoneme = phonemeNode ? phonemeNode.allText : '';
        if (phoneme) {
          lines.push(`\\prx="${phoneme}"\\`);
        }
        if (text) {
          lines.push(text);
        }
        return lines;
      }
      case 'bareIpa': {
        const phonemeNode = ast.children?.find(
          (child: any) => child && child.name === 'shortIpaValue',
        );
        const phoneme = phonemeNode ? phonemeNode.allText : '';
        if (phoneme) {
          lines.push(`\\prx="${phoneme}"\\`);
        }
        return lines;
      }
      case 'shortSub': {
        const textNode = ast.children?.find(
          (child: any) =>
            child &&
            (child.name === 'parenthesized' ||
              child.name === 'plainTextModifier'),
        );
        const text =
          textNode && textNode.name === 'parenthesized'
            ? this.extractParenthesizedText(textNode)
            : textNode?.allText || '';
        const aliasNode = ast.children?.find(
          (child: any) => child && child.name === 'shortSubValue',
        );
        const alias = aliasNode ? aliasNode.allText.trim() : '';
        if (alias) {
          lines.push(alias);
        } else if (text) {
          lines.push(text);
        }
        return lines;
      }
      case 'shortEmphasisModerate':
      case 'shortEmphasisStrong': {
        const text = ast.children[0].allText;
        lines.push('\\emph\\');
        if (text) {
          lines.push(text);
        }
        return lines;
      }
      case 'shortEmphasisNone':
      case 'shortEmphasisReduced': {
        const text = ast.children[0].allText;
        if (text) {
          lines.push(text);
        }
        return lines;
      }
      case 'textModifier': {
        return this.processTextModifier(ast, lines);
      }
      case 'audio':
        return lines;
      case 'section': {
        for (const child of ast.children) {
          if (child.name === 'sectionModifierKeyOptionalValue') {
            const key = child.children[0].allText;
            const value =
              child.children.length === 2 ? child.children[1].allText : '';
            switch (key) {
              case 'voice':
                if (value) {
                  lines.push(`\\vce=speaker=${value}\\`);
                }
                break;
              case 'defaults':
                lines.push('\\rst\\');
                break;
              default:
                break;
            }
          }
        }
        return lines;
      }
      default: {
        this.processAst(ast.children, lines);
        return lines;
      }
    }
  }

  private timeToMilliseconds(time: string): number {
    const match = time.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
    if (!match) {
      return 500;
    }
    const val = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 's') {
      return Math.round(val * 1000);
    }
    return Math.round(val);
  }

  private strengthToMs(strength: string): number {
    const map: Record<string, number> = {
      none: 0,
      'x-weak': 100,
      weak: 250,
      medium: 500,
      strong: 750,
      'x-strong': 1000,
    };
    return map[strength] || 500;
  }

  private extractParenthesizedText(node: any): string {
    if (!node || typeof node.allText !== 'string' || node.allText.length < 2) {
      return '';
    }
    const content = node.allText.substring(1, node.allText.length - 1);
    return content.trim();
  }
}
