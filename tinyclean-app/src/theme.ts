export const colors = {
  cyan: '#00D4FF',
  aqua: '#00C8CA',
  teal: '#00C896',
  text: 'rgb(39,39,42)',
  textMuted: 'rgb(82,82,91)',
  textSubtle: 'rgb(113,113,122)',
  divider: 'rgb(240,240,243)',
  border: 'rgb(232,232,236)',
  disabled: 'rgb(212,212,216)',
} as const;

// Primary brand gradient (left → right), see project CLAUDE.md.
export const brandGradient = [colors.cyan, colors.aqua, colors.teal] as const;
