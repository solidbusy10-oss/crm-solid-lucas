import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-rank-gold/20 text-rank-gold border-rank-gold/40";
  if (rank === 2) return "bg-rank-silver/20 text-rank-silver border-rank-silver/40";
  if (rank === 3) return "bg-rank-bronze/20 text-rank-bronze border-rank-bronze/40";
  return "bg-muted/30 text-muted-foreground border-border/30";
};

const getPercentBadge = (value: number) => {
  if (value >= 40) return { color: "bg-success/15 text-success border-success/30", icon: TrendingUp };
  if (value > 0) return { color: "bg-warning/15 text-warning border-warning/30", icon: TrendingDown };
  return { color: "bg-destructive/15 text-destructive border-destructive/30", icon: Minus };
};

const getAuditBadge = (value: number) => {
  if (value >= 70) return "bg-success/15 text-success border-success/30";
  if (value > 0) return "bg-warning/15 text-warning border-warning/30";
  return "bg-muted/20 text-muted-foreground border-border/20";
};

const RankingTable = ({ sellers }: RankingTableProps) => {
  return (
    <div className="w-full space-y-2">
      {sellers.map((seller, i) => {
        const convBadge = getPercentBadge(seller.conv);
        return (
          <div
            key={seller.rank}
            className="group relative flex items-center gap-3 rounded-lg border border-border/20 bg-secondary/20 px-4 py-3 transition-all duration-300 hover:bg-secondary/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Rank Badge */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-display text-base font-bold ${getRankStyle(seller.rank)}`}>
              {seller.rank}
            </div>

            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold font-display text-primary">
                  {seller.name.charAt(0)}
                </span>
              </div>
              {seller.rank <= 3 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rank-gold flex items-center justify-center">
                  <Trophy className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {seller.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {seller.cg} vendas
              </p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-center px-3 py-1 rounded-md bg-muted/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Form</p>
                <p className="text-sm font-bold text-foreground font-display">{seller.form}</p>
              </div>
              <div className="text-center px-3 py-1 rounded-md bg-muted/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">CG</p>
                <p className="text-sm font-bold text-foreground font-display">{seller.cg}</p>
              </div>
            </div>

            {/* Conv Badge */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${convBadge.color}`}>
              <convBadge.icon className="h-3 w-3" />
              {seller.conv}%
            </div>

            {/* Audit Badges */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${getAuditBadge(seller.audit)}`}>
                A {seller.audit}%
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${getAuditBadge(seller.auditTrc)}`}>
                T {seller.auditTrc}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankingTable;
