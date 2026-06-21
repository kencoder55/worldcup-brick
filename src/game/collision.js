export function circleIntersectsRect(circle, rect) {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeVelocity(vx, vy, speed) {
  const length = Math.hypot(vx, vy) || 1;

  return {
    vx: (vx / length) * speed,
    vy: (vy / length) * speed,
  };
}
