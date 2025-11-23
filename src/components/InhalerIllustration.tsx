import inhalerLogo from 'figma:asset/675c19bf4fd1ef0decbfcf6369243c7c03b2a811.png';

export function InhalerIllustration() {
  return (
    <div className="flex items-start justify-center overflow-hidden h-80">
      <img src={inhalerLogo} alt="RXhale Inhalers" className="w-80 h-auto" />
    </div>
  );
}