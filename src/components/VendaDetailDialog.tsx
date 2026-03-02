import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, User, Phone, Mail, FileText, UserCheck,
  ClipboardCheck, Volume2, Save, CheckCircle2, AlertCircle,
  Download, Lock,
} from "lucide-react";

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

interface Checklist {
  id?: string;
  endereco_correto: boolean;
  confirmou_dados: boolean;
  passou_info_plano: boolean;
  fez_upsell: boolean;
  passou_confianca: boolean;
  entonacao_voz_boa: boolean;
  nome_completo_confirmado: boolean;
  cpf_confirmado: boolean;
  telefone_confirmado: boolean;
  endereco_confirmado: boolean;
  plano_informado: boolean;
  valor_informado: boolean;
  fidelidade_informada: boolean;
  primeira_fatura_informada: boolean;
  app_nio_informado: boolean;
  seguranca_dados_informada: boolean;
  comodato_informado: boolean;
  multa_equipamento_informada: boolean;
  congelamento_valor_informado: boolean;
  mensagem_oficial_informada: boolean;
  canais_atendimento_informados: boolean;
  confirmacao_ok_sim: boolean;
  agendamento_confirmado: boolean;
  duvidas_perguntadas: boolean;
  observacao: string;
}

const defaultChecklist: Checklist = {
  endereco_correto: false,
  confirmou_dados: false,
  passou_info_plano: false,
  fez_upsell: false,
  passou_confianca: false,
  entonacao_voz_boa: false,
  nome_completo_confirmado: false,
  cpf_confirmado: false,
  telefone_confirmado: false,
  endereco_confirmado: false,
  plano_informado: false,
  valor_informado: false,
  fidelidade_informada: false,
  primeira_fatura_informada: false,
  app_nio_informado: false,
  seguranca_dados_informada: false,
  comodato_informado: false,
  multa_equipamento_informada: false,
  congelamento_valor_informado: false,
  mensagem_oficial_informada: false,
  canais_atendimento_informados: false,
  confirmacao_ok_sim: false,
  agendamento_confirmado: false,
  duvidas_perguntadas: false,
  observacao: "",
};

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "concluído": case "concluida": case "instalada": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "em andamento": case "em progresso": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "cancelado": case "cancelada": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
};

const checkLabels: { field: keyof Checklist; label: string; group: "questionario" | "auditoria" }[] = [
  { field: "endereco_correto", label: "Endereço está correto?", group: "questionario" },
  { field: "confirmou_dados", label: "Confirmou o endereço e os dados do cliente?", group: "questionario" },
  { field: "passou_info_plano", label: "Passou as informações do plano para o cliente?", group: "questionario" },
  { field: "fez_upsell", label: "Fez upsell?", group: "questionario" },
  { field: "passou_confianca", label: "Passou confiança para o cliente?", group: "questionario" },
  { field: "entonacao_voz_boa", label: "Entonação da voz foi boa?", group: "questionario" },
  { field: "nome_completo_confirmado", label: "Confirmou nome completo do titular", group: "auditoria" },
  { field: "cpf_confirmado", label: "Confirmou CPF/CNPJ", group: "auditoria" },
  { field: "telefone_confirmado", label: "Informou telefone para contato", group: "auditoria" },
  { field: "endereco_confirmado", label: "Informou endereço de instalação", group: "auditoria" },
  { field: "plano_informado", label: "Informou plano contratado (megas)", group: "auditoria" },
  { field: "valor_informado", label: "Informou valor da mensalidade", group: "auditoria" },
  { field: "fidelidade_informada", label: "Informou fidelidade de 12 meses e multa proporcional", group: "auditoria" },
  { field: "primeira_fatura_informada", label: "Informou prazo de 25 dias para 1ª fatura + app NIO", group: "auditoria" },
  { field: "app_nio_informado", label: "Apresentou o app da NIO e suas funcionalidades", group: "auditoria" },
  { field: "seguranca_dados_informada", label: "Informou sobre segurança de dados e canais suspeitos", group: "auditoria" },
  { field: "comodato_informado", label: "Informou que equipamento é comodato", group: "auditoria" },
  { field: "multa_equipamento_informada", label: "Informou multa de R$400 por perda/dano do equipamento", group: "auditoria" },
  { field: "congelamento_valor_informado", label: "Informou congelamento de valor até 31/01/2028", group: "auditoria" },
  { field: "mensagem_oficial_informada", label: "Informou sobre mensagem oficial da NIO com detalhes", group: "auditoria" },
  { field: "canais_atendimento_informados", label: "Informou canais de atendimento (0800, WhatsApp)", group: "auditoria" },
  { field: "confirmacao_ok_sim", label: 'Solicitou confirmação com "OK" ou "SIM"', group: "auditoria" },
  { field: "agendamento_confirmado", label: "Confirmou data do agendamento", group: "auditoria" },
  { field: "duvidas_perguntadas", label: "Perguntou se há dúvidas", group: "auditoria" },
];

interface Props {
  venda: PosVendaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VendaDetailDialog({ venda, open, onOpenChange }: Props) {
  const [checklist, setChecklist] = useState<Checklist>(defaultChecklist);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { role } = useUserRole();

  const isLocked = !!existingId;
  const canEdit = !isLocked || role === "supervisor";

  useEffect(() => {
    if (!venda || !open) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("pos_venda_checklist")
        .select("*")
        .eq("pos_venda_id", venda.id)
        .maybeSingle();

      if (data) {
        setExistingId(data.id);
        const { id, pos_venda_id, respondido_por, created_at, updated_at, ...rest } = data;
        setChecklist({ ...defaultChecklist, ...rest, observacao: rest.observacao ?? "" });
      } else {
        setExistingId(null);
        setChecklist(defaultChecklist);
      }
      setLoading(false);
    })();
  }, [venda, open]);

  const toggle = (key: keyof Checklist) => {
    if (!canEdit) return;
    if (typeof checklist[key] === "boolean") {
      setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSave = async () => {
    if (!venda || !canEdit) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const payload = {
      pos_venda_id: venda.id,
      respondido_por: user.id,
      ...checklist,
    };

    let error;
    if (existingId) {
      ({ error } = await supabase.from("pos_venda_checklist").update(payload).eq("id", existingId));
    } else {
      ({ error } = await supabase.from("pos_venda_checklist").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Checklist salvo com sucesso!" });
      if (!existingId) {
        // Re-fetch to lock
        const { data: newData } = await supabase
          .from("pos_venda_checklist")
          .select("id")
          .eq("pos_venda_id", venda.id)
          .maybeSingle();
        if (newData) setExistingId(newData.id);
      }
    }
  };

  const handleDownload = () => {
    if (!venda) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentW = w - margin * 2;
    let y = 0;

    // Colors matching CRM theme
    const navy = [15, 23, 42] as const;       // bg
    const darkBlue = [20, 30, 55] as const;   // sections
    const accent = [59, 130, 246] as const;   // primary blue
    const white = [255, 255, 255] as const;
    const gray = [148, 163, 184] as const;
    const green = [34, 197, 94] as const;
    const red = [239, 68, 68] as const;

    const checkPage = (needed: number) => {
      if (y + needed > h - 15) {
        doc.addPage();
        // page bg
        doc.setFillColor(...navy);
        doc.rect(0, 0, w, h, "F");
        y = 15;
      }
    };

    // Full page dark background
    doc.setFillColor(...navy);
    doc.rect(0, 0, w, h, "F");

    // Header bar
    doc.setFillColor(...accent);
    doc.rect(0, 0, w, 32, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...white);
    doc.text("SOLID BUSINESS", margin, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Relatório Pós-Venda", margin, 21);
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 230);
    doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, w - margin, 14, { align: "right" });
    doc.text(`OS ${venda.numero_os}`, w - margin, 21, { align: "right" });

    y = 40;

    // --- Section helper ---
    const drawSection = (title: string) => {
      checkPage(14);
      doc.setFillColor(...darkBlue);
      doc.roundedRect(margin - 2, y - 2, contentW + 4, 10, 2, 2, "F");
      doc.setFillColor(...accent);
      doc.rect(margin - 2, y - 2, 3, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...white);
      doc.text(title, margin + 4, y + 5);
      y += 14;
    };

    // --- Info row helper ---
    const drawInfo = (label: string, value: string) => {
      checkPage(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      doc.text(label, margin + 2, y);
      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.text(value || "—", margin + 45, y);
      y += 7;
    };

    // --- Check row helper ---
    const drawCheck = (label: string, checked: boolean) => {
      checkPage(7);
      // Checkbox
      doc.setDrawColor(...gray);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin + 2, y - 3.2, 4, 4, 0.8, 0.8, "S");
      if (checked) {
        doc.setFillColor(...green);
        doc.roundedRect(margin + 2.6, y - 2.6, 2.8, 2.8, 0.5, 0.5, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(checked ? [...white] as any : [...gray] as any);
      doc.text(label, margin + 9, y);
      // Status text
      doc.setFontSize(7.5);
      doc.setTextColor(checked ? [...green] as any : [...red] as any);
      doc.text(checked ? "SIM" : "NÃO", w - margin, y, { align: "right" });
      y += 6.5;
    };

    // ===== DADOS DA VENDA =====
    drawSection("DADOS DA VENDA");
    drawInfo("CPF:", venda.cpf_cliente);
    drawInfo("Endereço:", venda.endereco || "—");
    drawInfo("Telefone:", venda.telefone_contato || "—");
    drawInfo("Email:", venda.email_cliente || "—");
    drawInfo("Nº OS:", venda.numero_os);
    drawInfo("Vendedor:", venda.vendedor_nome);
    drawInfo("Status:", venda.status);
    drawInfo("Agendamento:", venda.status_agendamento);
    drawInfo("Pendência:", venda.pendencia || "—");
    y += 4;

    // ===== QUESTIONÁRIO =====
    drawSection("QUESTIONÁRIO PÓS-VENDA");
    checkLabels.filter((c) => c.group === "questionario").forEach((c) => {
      drawCheck(c.label, checklist[c.field] as boolean);
    });
    y += 4;

    // ===== AUDITORIA =====
    drawSection("CHECKLIST DA AUDITORIA");
    checkLabels.filter((c) => c.group === "auditoria").forEach((c) => {
      drawCheck(c.label, checklist[c.field] as boolean);
    });
    y += 4;

    // ===== OBSERVAÇÃO =====
    drawSection("OBSERVAÇÃO");
    checkPage(20);
    doc.setFillColor(...darkBlue);
    const obsText = checklist.observacao || "(sem observação)";
    const splitObs = doc.splitTextToSize(obsText, contentW - 8);
    const obsH = Math.max(splitObs.length * 5 + 8, 16);
    doc.roundedRect(margin, y - 2, contentW, obsH, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text(splitObs, margin + 4, y + 4);
    y += obsH + 6;

    // Footer line
    checkPage(12);
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.5);
    doc.line(margin, y, w - margin, y);
    y += 6;
    doc.setFontSize(7);
    doc.setTextColor(...gray);
    doc.text("Solid Business — Sistema CRM Pós-Venda", w / 2, y, { align: "center" });

    doc.save(`relatorio-pos-venda-${venda.numero_os}.pdf`);
  };

  if (!venda) return null;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value || "—"}</p>
      </div>
    </div>
  );

  const CheckItem = ({ label, field }: { label: string; field: keyof Checklist }) => (
    <label className={`flex items-center gap-3 py-1.5 rounded px-2 -mx-2 transition-colors ${canEdit ? "cursor-pointer hover:bg-muted/20" : "cursor-default opacity-80"}`}>
      <Checkbox
        checked={checklist[field] as boolean}
        onCheckedChange={() => toggle(field)}
        disabled={!canEdit}
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-card border-border">
        <DialogHeader className="p-5 pb-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              OS {venda.numero_os}
              <Badge variant="outline" className={`ml-2 text-xs ${statusColor(venda.status)}`}>
                {venda.status}
              </Badge>
            </DialogTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              Baixar Relatório
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-5 space-y-5">
            {/* Dados da Venda */}
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Dados da Venda
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={User} label="CPF" value={venda.cpf_cliente} />
                <InfoRow icon={MapPin} label="Endereço" value={venda.endereco} />
                <InfoRow icon={Phone} label="Telefone" value={venda.telefone_contato} />
                <InfoRow icon={Mail} label="Email" value={venda.email_cliente} />
                <InfoRow icon={FileText} label="Nº OS" value={venda.numero_os} />
                <InfoRow icon={UserCheck} label="Vendedor" value={venda.vendedor_nome} />
                <InfoRow icon={ClipboardCheck} label="Agendamento" value={venda.status_agendamento} />
                <InfoRow icon={AlertCircle} label="Pendência" value={venda.pendencia} />
              </div>
            </div>

            {/* Áudio da Auditoria */}
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Volume2 className="h-4 w-4" /> Áudio da Auditoria
              </h3>
              {venda.audio_auditoria_url ? (
                <audio controls className="w-full" src={venda.audio_auditoria_url}>
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              ) : (
                <p className="text-sm text-muted-foreground italic">Nenhum áudio disponível</p>
              )}
            </div>

            <Separator className="bg-border/40" />

            {/* Locked banner */}
            {isLocked && role !== "supervisor" && (
              <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-3 border border-border/40">
                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Este checklist já foi preenchido e está bloqueado para edição.
                </p>
              </div>
            )}

            {isLocked && role === "supervisor" && (
              <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-3 border border-primary/20">
                <UserCheck className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm text-primary">
                  Modo supervisor — você pode editar este checklist.
                </p>
              </div>
            )}

            {/* Questionário Pós-Venda */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="glass-card rounded-lg p-4">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" /> Questionário Pós-Venda
                  </h3>
                  <div className="space-y-0.5">
                    {checkLabels.filter((c) => c.group === "questionario").map((c) => (
                      <CheckItem key={c.field} label={c.label} field={c.field} />
                    ))}
                  </div>
                </div>

                {/* Auditoria Checklist */}
                <div className="glass-card rounded-lg p-4">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Checklist da Auditoria
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Verifique se o colaborador seguiu o script corretamente
                  </p>
                  <div className="space-y-0.5">
                    {checkLabels.filter((c) => c.group === "auditoria").map((c) => (
                      <CheckItem key={c.field} label={c.label} field={c.field} />
                    ))}
                  </div>
                </div>

                {/* Observação */}
                <div className="glass-card rounded-lg p-4">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    Observação
                  </h3>
                  <Textarea
                    placeholder="Escreva os pontos observados pela equipe de pós-venda..."
                    value={checklist.observacao}
                    onChange={(e) => setChecklist((p) => ({ ...p, observacao: e.target.value }))}
                    className="bg-secondary/50 border-border/40 min-h-[100px]"
                    disabled={!canEdit}
                  />
                </div>

                {canEdit && (
                  <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? "Salvando..." : existingId ? "Atualizar Checklist" : "Salvar Checklist"}
                  </Button>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
