export function RoughNavMarker() {
  return (
    <svg className="pv-nav-marker" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="pv-nav-marker-ink"
        data-slot="brush-stroke"
        fill="none"
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
        d="M2 5.2 C14 4.3 25 5.8 38 4.9 C52 3.9 66 5.6 79 4.8 C87 4.4 93 4.7 98 5"
      />
    </svg>
  )
}
