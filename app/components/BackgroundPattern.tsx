import { MAGIC_PATTERN_SVG } from '../constants';

export default function BackgroundPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'repeat',
        backgroundImage: MAGIC_PATTERN_SVG
      }}
    />
  );
}
