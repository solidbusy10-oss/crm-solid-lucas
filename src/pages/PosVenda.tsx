import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VendaDetailDialog from "@/components/VendaDetailDialog";

interface PosVendaItem {
  id: string;
  cpf_cliente: string;
  numero_os: string;
  vendedor_nome: string;
  vendedor_id: string;
  status: string;
  status_agendamento: string;
  pendencia: string | null;
  endereco: string | null;
  telefone_contato: string | null;
  email_cliente: string | null;
  plano_contratado: string | null;
  valor_mensalidade: string | null;
  audio_auditoria_url: string | null;
  created_at: string;
}

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "concluído": case "concluida": case "instalada": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "em andamento": case "em progresso": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "cancelado": case "cancelada": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
};

const agendamentoColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "agendado": case "confirmado": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "reagendar": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "não agendado": return "bg-muted text-muted-foreground border-border";
    default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
};

const PosVenda = () => {
  const [data, setData] = useState<PosVendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVenda, setSelectedVenda] = useState<PosVendaItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("pos_venda")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && rows) {
        setData(rows as unknown as PosVendaItem[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.cpf_cliente.toLowerCase().includes(q) ||
      item.numero_os.toLowerCase().includes(q) ||
      item.vendedor_nome.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.status_agendamento.toLowerCase().includes(q) ||
      (item.pendencia && item.pendencia.toLowerCase().includes(q))
    );
  });

  const handleRowClick = (item: PosVendaItem) => {
    setSelectedVenda(item);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <ClipboardList className="h-7 w-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-display text-primary tracking-wide">
            Pós Venda
          </h1>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-semibold font-display text-foreground">
              Todas as Vendas
            </h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por CPF, OS, vendedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary/50 border-border/40"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma venda encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">CPF Cliente</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Nº OS</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Vendedor</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Agendamento</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Pendência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="font-mono text-sm">{item.cpf_cliente}</TableCell>
                      <TableCell className="font-mono text-sm font-semibold">{item.numero_os}</TableCell>
                      <TableCell className="text-sm">{item.vendedor_nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${agendamentoColor(item.status_agendamento)}`}>
                          {item.status_agendamento}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {item.pendencia || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-xs text-muted-foreground text-right">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <VendaDetailDialog
        venda={selectedVenda}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default PosVenda;
