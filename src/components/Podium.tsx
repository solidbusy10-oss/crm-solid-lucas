import { Trophy, Medal, Award } from "lucide-react";

interface PodiumPlayer {
  name: string;
  score: number;
  position: 1 | 2 | 3;
}

interface PodiumProps {
  players: PodiumPlayer[];
}

const positionConfig = {
  1: {
    height: "h-32",
    color: "text-rank-gold",
    bgColor: "bg-secondary/80",
    icon: Trophy,
    label: "1º",
    order: "order-2",
    avatarSize: "w-20 h-20",
  },
  2: {
    height: "h-24",
    color: "text-rank-silver",
    bgColor: "bg-secondary/60",
    icon: Medal,
    label: "2º",
    order: "order-1",
    avatarSize: "w-16 h-16",
  },
  3: {
    height: "h-20",
    color: "text-rank-bronze",
    bgColor: "bg-secondary/50",
    icon: Award,
    label: "3º",
    order: "order-3",
    avatarSize: "w-16 h-16",
  },
};

const Podium = ({ players }: PodiumProps) => {
  return (
    <div className="flex items-end justify-center gap-3 mt-6">
      {players.map((player) => {
        const config = positionConfig[player.position];
        const Icon = config.icon;
        return (
          <div
            key={player.position}
            className={`flex flex-col items-center ${config.order}`}
          >
            {/* Avatar */}
            <div
              className={`${config.avatarSize} rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center mb-2 overflow-hidden`}
            >
              <span className="text-lg font-bold font-display text-muted-foreground">
                {player.name.charAt(0)}
              </span>
            </div>
            <span className="text-xs font-semibold text-foreground mb-1 text-center leading-tight">
              {player.name}
            </span>
            <span className="text-xs text-muted-foreground mb-2">{player.score}</span>
            {/* Podium block */}
            <div
              className={`${config.height} w-24 ${config.bgColor} rounded-t-lg flex flex-col items-center justify-center border border-border/50`}
            >
              <Icon className={`w-8 h-8 ${config.color}`} />
              <span className={`text-sm font-bold font-display ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Podium;
