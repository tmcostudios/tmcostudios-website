/**
 * Placeholder for content that will eventually be a real photo/video.
 * Renders a dashed-border box with a label so the layout is final
 * before real media is dropped in.
 */
export default function MediaSlot({ label = 'Upload media', aspect = '1 / 1', className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-muted">
          +
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </div>
    </div>
  )
}
