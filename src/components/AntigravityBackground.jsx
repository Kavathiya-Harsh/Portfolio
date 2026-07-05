import { useCallback } from 'react';
import { ParticlesProvider, Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { usePerformance } from '../context/PerformanceContext';

function AntigravityParticles() {
  const { isLowPower } = usePerformance();
  const particleCount = isLowPower ? 55 : 95;

  const options = {
    background: {
      color: { value: 'transparent' },
    },
    fpsLimit: isLowPower ? 60 : 120,
    interactivity: {
      events: {
        onHover: {
          enable: !isLowPower,
          mode: 'attract',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
        resize: { enable: true },
      },
      modes: {
        attract: {
          distance: 220,
          duration: 0.6,
          factor: 0.6,
        },
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: {
        value: ['#00f5ff', '#a855f7', '#c026d3', '#67e8f9'],
      },
      links: {
        color: '#00f5ff',
        distance: 130,
        enable: true,
        opacity: 0.225,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.75,
        direction: 'top',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: true,
          rotate: { x: 600, y: 1200 },
        },
      },
      number: {
        value: particleCount,
        density: {
          enable: true,
          area: 850,
        },
      },
      opacity: {
        value: 0.585,
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.225,
        },
      },
      shape: {
        type: ['circle', 'triangle'],
      },
      size: {
        value: { min: 1.8, max: 4.2 },
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.8,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="antigravity-bg"
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.85,  // 10% visibility reduction
      }}
    />
  );
}

const AntigravityBackground = () => {
  // useCallback ensures the init function reference is stable across renders
  // (required by ParticlesProvider — it will throw if init changes identity)
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParticlesProvider init={init}>
      <AntigravityParticles />
    </ParticlesProvider>
  );
};

export default AntigravityBackground;
