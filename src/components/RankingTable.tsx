interface Seller {
  rank: number;
  name: string;
  form: number;
  cg: number;
  conv: number;
  audit: number;
  auditTrc: number;
}

interface RankingTableProps {
  sellers: Seller[];
}

const getPercentColor = (value: number) => {
  if (value >= 40) return "text-success";
  if (value > 0) return "text-destructive";
  return "text-destructive";
};

const RankingTable = ({ sellers }: RankingTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-3 px-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8">
              #
            </th>
            <th className="py-3 px-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground" />
            <th className="py-3 px-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome
            </th>
            <th className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Form
            </th>
            <th className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CG
            </th>
            <th className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              % Conv
            </th>
            <th className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              % Audit
            </th>
            <th className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              % Audit TRC
            </th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller, i) => (
            <tr
              key={seller.rank}
              className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <td className="py-3 px-2">
                <span className="text-lg font-bold font-display text-primary">
                  {seller.rank}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="w-10 h-10 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                  <span className="text-sm font-bold font-display text-muted-foreground">
                    {seller.name.charAt(0)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2 font-semibold text-foreground whitespace-nowrap">
                {seller.name}
              </td>
              <td className="py-3 px-2 text-center text-foreground">{seller.form}</td>
              <td className="py-3 px-2 text-center text-foreground">{seller.cg}</td>
              <td className={`py-3 px-2 text-center font-semibold ${getPercentColor(seller.conv)}`}>
                {seller.conv}%
              </td>
              <td className={`py-3 px-2 text-center font-semibold ${seller.audit > 0 ? 'text-success' : 'text-destructive'}`}>
                {seller.audit}%
              </td>
              <td className={`py-3 px-2 text-center font-semibold ${seller.auditTrc > 0 ? 'text-success' : 'text-destructive'}`}>
                {seller.auditTrc}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;
