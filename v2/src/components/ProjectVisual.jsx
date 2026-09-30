/** Abstract browser-mockup visual. Original placeholder — swap for real screenshots later. */
export default function ProjectVisual({ project, glyph }) {
  return (
    <div className="visual" data-cursor="view" style={{ "--hue": project.hue }}>
      <div className="visual-bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="visual-body" aria-hidden="true">
        <b style={{ width: "42%" }} />
        <b style={{ width: "88%" }} />
        <b style={{ width: "71%" }} />
        <b style={{ width: "55%" }} />
      </div>
      <span className="visual-glyph" aria-hidden="true">{glyph}</span>
    </div>
  );
}
