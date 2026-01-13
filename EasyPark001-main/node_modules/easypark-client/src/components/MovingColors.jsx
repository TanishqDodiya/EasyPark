import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function MovingColors() {
  const { isDark } = useTheme();
  const [orbs, setOrbs] = useState([]);

  // Initialize orbs with random positions and properties
  useEffect(() => {
    const colors = [
      'cyan', 'purple', 'blue', 'pink', 'emerald', 'orange', 'indigo', 'teal',
      'yellow', 'red', 'violet', 'lime', 'rose', 'amber', 'sky', 'fuchsia'
    ];

    const initialOrbs = colors.map((color, index) => ({
      id: index,
      color,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100, // 100-300px
      opacity: isDark ? Math.random() * 0.3 + 0.1 : Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
      speedY: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2, // -1 to 1 degrees per frame
      scale: Math.random() * 0.5 + 0.75, // 0.75 to 1.25
      scaleDirection: Math.random() > 0.5 ? 1 : -1,
    }));

    setOrbs(initialOrbs);
  }, [isDark]);

  // Animation loop
  useEffect(() => {
    const animateOrbs = () => {
      setOrbs(prevOrbs => 
        prevOrbs.map(orb => {
          let newX = orb.x + orb.speedX;
          let newY = orb.y + orb.speedY;
          let newSpeedX = orb.speedX;
          let newSpeedY = orb.speedY;

          // Bounce off edges
          if (newX <= -10 || newX >= 110) {
            newSpeedX = -orb.speedX;
            newX = Math.max(-10, Math.min(110, newX));
          }
          if (newY <= -10 || newY >= 110) {
            newSpeedY = -orb.speedY;
            newY = Math.max(-10, Math.min(110, newY));
          }

          // Update scale with oscillation
          let newScale = orb.scale + (orb.scaleDirection * 0.002);
          let newScaleDirection = orb.scaleDirection;
          
          if (newScale >= 1.3 || newScale <= 0.7) {
            newScaleDirection = -orb.scaleDirection;
          }

          return {
            ...orb,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: (orb.rotation + orb.rotationSpeed) % 360,
            scale: newScale,
            scaleDirection: newScaleDirection,
          };
        })
      );
    };

    const intervalId = setInterval(animateOrbs, 50); // 20 FPS
    return () => clearInterval(intervalId);
  }, []);

  // Update opacity when theme changes
  useEffect(() => {
    setOrbs(prevOrbs => 
      prevOrbs.map(orb => ({
        ...orb,
        opacity: isDark ? Math.random() * 0.15 + 0.05 : Math.random() * 0.2 + 0.1,
      }))
    );
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map(orb => (
        <div
          key={orb.id}
          className={`absolute rounded-full blur-3xl transition-opacity duration-1000 bg-gradient-radial from-${orb.color}-400 to-transparent`}
          style={{
            left: `${orb.x}vw`,
            top: `${orb.y}vh`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            opacity: orb.opacity,
            transform: `translate(-50%, -50%) rotate(${orb.rotation}deg) scale(${orb.scale})`,
            transition: 'left 0.05s linear, top 0.05s linear, transform 0.05s linear',
          }}
        />
      ))}
      
      {/* Additional animated gradients for more movement */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
          `,
          animation: 'moveGradient 20s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export default MovingColors;