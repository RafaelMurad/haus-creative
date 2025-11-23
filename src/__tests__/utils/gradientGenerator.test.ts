import {
  generateGradient,
  generateAnimatedGradientStyle,
  gradientPresets,
  getGradientKeyframes,
} from '@/utils/gradientGenerator';

describe('gradientGenerator', () => {
  describe('generateGradient', () => {
    it('generates a basic linear gradient', () => {
      const result = generateGradient(['#ff0000', '#00ff00']);
      expect(result).toBe('linear-gradient(135deg, #ff0000, #00ff00)');
    });

    it('generates a gradient with custom direction', () => {
      const result = generateGradient(['#ff0000', '#00ff00'], 90);
      expect(result).toBe('linear-gradient(90deg, #ff0000, #00ff00)');
    });

    it('handles multiple colours', () => {
      const result = generateGradient(['#ff0000', '#00ff00', '#0000ff', '#ffff00']);
      expect(result).toBe('linear-gradient(135deg, #ff0000, #00ff00, #0000ff, #ffff00)');
    });

    it('throws error with less than 2 colours', () => {
      expect(() => generateGradient(['#ff0000'])).toThrow('Gradient requires at least 2 colours');
    });

    it('works with readonly arrays from presets', () => {
      const result = generateGradient(gradientPresets.warmTan);
      expect(result).toContain('linear-gradient');
      expect(result).toContain('#D4A574');
    });
  });

  describe('generateAnimatedGradientStyle', () => {
    it('generates complete style object with defaults', () => {
      const result = generateAnimatedGradientStyle({
        colours: ['#ff0000', '#00ff00'],
      });

      expect(result).toEqual({
        background: 'linear-gradient(135deg, #ff0000, #00ff00)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      });
    });

    it('applies custom configuration', () => {
      const result = generateAnimatedGradientStyle({
        colours: ['#ff0000', '#00ff00'],
        direction: 90,
        backgroundSize: '200% 200%',
        animationDuration: 10,
        animationTiming: 'linear',
      });

      expect(result).toEqual({
        background: 'linear-gradient(90deg, #ff0000, #00ff00)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 10s linear infinite',
      });
    });

    it('works with gradient presets', () => {
      const result = generateAnimatedGradientStyle({
        colours: gradientPresets.deepBlue,
      });

      expect(result.background).toContain('#1a3a52');
      expect(result.backgroundSize).toBe('400% 400%');
    });
  });

  describe('gradientPresets', () => {
    it('contains warmTan preset', () => {
      expect(gradientPresets.warmTan).toEqual([
        '#D4A574',
        '#E8B88A',
        '#C89968',
        '#B88A5E',
      ]);
    });

    it('contains deepBlue preset', () => {
      expect(gradientPresets.deepBlue).toEqual([
        '#1a3a52',
        '#2a5578',
        '#1e4d6b',
        '#15314a',
      ]);
    });

    it('all presets have at least 2 colours', () => {
      Object.values(gradientPresets).forEach((preset) => {
        expect(preset.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('getGradientKeyframes', () => {
    it('returns CSS keyframes string', () => {
      const result = getGradientKeyframes();
      expect(result).toContain('@keyframes gradientShift');
      expect(result).toContain('0%');
      expect(result).toContain('50%');
      expect(result).toContain('100%');
      expect(result).toContain('background-position');
    });
  });
});
