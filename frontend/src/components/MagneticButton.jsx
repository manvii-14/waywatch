import React, { useState } from 'react';

export default function MagneticButton({ children, style, onClick, type = "button", onMouseEnter, onMouseLeave }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate distance from center of button and apply a 30% magnetic pull
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  const handleMouseLeaveInternal = (e) => {
    setPos({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveInternal}
      onMouseEnter={onMouseEnter}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        // Smooth snap-back when cursor leaves, instant track when inside
        transition: pos.x === 0 && pos.y === 0 
          ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s ease, color 0.2s ease' 
          : 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      {children}
    </button>
  );
}