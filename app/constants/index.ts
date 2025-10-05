// Petal animation configurations
export const PETAL_ANIMATIONS = [
  { x: '15%', y: '20%', delay: 0, duration: 8 },
  { x: '25%', y: '35%', delay: 1, duration: 10 },
  { x: '18%', y: '50%', delay: 2, duration: 9 },
  { x: '30%', y: '15%', delay: 1.5, duration: 11 },
  { x: '22%', y: '65%', delay: 0.5, duration: 10 },
  { x: '12%', y: '40%', delay: 2.5, duration: 9 },
  { x: '35%', y: '25%', delay: 3, duration: 12 },
  { x: '20%', y: '75%', delay: 1, duration: 10 },
  { x: '65%', y: '30%', delay: 2, duration: 11 },
  { x: '70%', y: '50%', delay: 1.5, duration: 9 },
  { x: '75%', y: '20%', delay: 3, duration: 10 },
  { x: '80%', y: '45%', delay: 0.5, duration: 12 },
  { x: '8%', y: '60%', delay: 1.8, duration: 9 },
  { x: '42%', y: '10%', delay: 2.2, duration: 11 },
  { x: '55%', y: '70%', delay: 0.8, duration: 10 },
  { x: '38%', y: '55%', delay: 4, duration: 8 },
  { x: '85%', y: '35%', delay: 1.2, duration: 12 },
  { x: '5%', y: '80%', delay: 3.5, duration: 9 },
  { x: '60%', y: '15%', delay: 0.3, duration: 11 },
  { x: '90%', y: '60%', delay: 2.8, duration: 10 },
  { x: '28%', y: '85%', delay: 1.7, duration: 8 },
  { x: '50%', y: '5%', delay: 4.2, duration: 12 },
  { x: '10%', y: '25%', delay: 0.7, duration: 9 },
  { x: '78%', y: '75%', delay: 3.2, duration: 11 },
  { x: '45%', y: '40%', delay: 1.4, duration: 10 },
  { x: '95%', y: '25%', delay: 2.6, duration: 8 },
  { x: '33%', y: '90%', delay: 0.9, duration: 12 },
  { x: '88%', y: '10%', delay: 3.8, duration: 9 },
  // Additional petals for more density
  { x: '14%', y: '12%', delay: 2.3, duration: 10 },
  { x: '48%', y: '28%', delay: 1.1, duration: 9 },
  { x: '62%', y: '42%', delay: 3.4, duration: 11 },
  { x: '26%', y: '58%', delay: 0.6, duration: 8 },
  { x: '72%', y: '68%', delay: 2.9, duration: 10 },
  { x: '40%', y: '78%', delay: 1.6, duration: 12 },
  { x: '82%', y: '22%', delay: 3.7, duration: 9 },
  { x: '16%', y: '48%', delay: 0.4, duration: 11 },
  { x: '58%', y: '8%', delay: 2.1, duration: 10 },
  { x: '92%', y: '52%', delay: 1.9, duration: 8 },
  { x: '36%', y: '72%', delay: 3.1, duration: 12 },
  { x: '68%', y: '38%', delay: 0.8, duration: 9 },
  { x: '24%', y: '92%', delay: 2.7, duration: 11 },
  { x: '86%', y: '18%', delay: 1.3, duration: 10 },
  { x: '52%', y: '62%', delay: 3.9, duration: 8 },
  { x: '7%', y: '32%', delay: 0.2, duration: 12 }
] as const;

// Feature items for the home page
export const FEATURES = [
  {
    icon: 'gift',
    title: 'Premium Products',
    description: 'Organic and natural beauty products for the best care',
    iconPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
  },
  {
    icon: 'users',
    title: 'Expert Stylists',
    description: 'Professional team with years of experience',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    icon: 'heart',
    title: 'Relaxing Atmosphere',
    description: 'Peaceful environment for your complete relaxation',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  }
] as const;

// SVG background pattern
export const MAGIC_PATTERN_SVG = 'url("data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3CclipPath id=%22a%22%3E%3Cpath fill=%22currentColor%22 d=%22M854.5 637Q718 774 580.5 761.5T273 720q-170-29-103.5-188T331 275q95-98 275-115.5T888.5 321q102.5 179-34 316Z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3Cg clip-path=%22url(%23a)%22%3E%3Cpath fill=%22%23FFB7C5%22 d=%22M854.5 637Q718 774 580.5 761.5T273 720q-170-29-103.5-188T331 275q95-98 275-115.5T888.5 321q102.5 179-34 316Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")';
