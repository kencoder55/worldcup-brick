export function ScreenShell({ children, className = '' }) {
  return <main className={`screen-shell ${className}`.trim()}>{children}</main>;
}
