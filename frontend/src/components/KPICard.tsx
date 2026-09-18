export const KPICard = ({ icon, title, value, tone, plain = false }: { icon: string; title: string; value: number; tone: string; plain?: boolean }) => (
  <article className={`metric-card ${tone}`}><div className="metric-icon">{icon}</div><div><p>{title}</p><h2>{plain ? value : `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h2></div></article>
);
