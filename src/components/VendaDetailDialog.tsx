import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    if (typeof checklist[key] === "boolean") {
      setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSave = async () => {
    if (!venda) return;
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
    }
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
    <label className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-muted/20 rounded px-2 -mx-2 transition-colors">
      <Checkbox
        checked={checklist[field] as boolean}
        onCheckedChange={() => toggle(field)}
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-card border-border">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            OS {venda.numero_os}
            <Badge variant="outline" className={`ml-2 text-xs ${statusColor(venda.status)}`}>
              {venda.status}
            </Badge>
          </DialogTitle>
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
                    <CheckItem label="Endereço está correto?" field="endereco_correto" />
                    <CheckItem label="Confirmou o endereço e os dados do cliente?" field="confirmou_dados" />
                    <CheckItem label="Passou as informações do plano para o cliente?" field="passou_info_plano" />
                    <CheckItem label="Fez upsell?" field="fez_upsell" />
                    <CheckItem label="Passou confiança para o cliente?" field="passou_confianca" />
                    <CheckItem label="Entonação da voz foi boa?" field="entonacao_voz_boa" />
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
                    <CheckItem label="Confirmou nome completo do titular" field="nome_completo_confirmado" />
                    <CheckItem label="Confirmou CPF/CNPJ" field="cpf_confirmado" />
                    <CheckItem label="Informou telefone para contato" field="telefone_confirmado" />
                    <CheckItem label="Informou endereço de instalação" field="endereco_confirmado" />
                    <CheckItem label="Informou plano contratado (megas)" field="plano_informado" />
                    <CheckItem label="Informou valor da mensalidade" field="valor_informado" />
                    <CheckItem label="Informou fidelidade de 12 meses e multa proporcional" field="fidelidade_informada" />
                    <CheckItem label="Informou prazo de 25 dias para 1ª fatura + app NIO" field="primeira_fatura_informada" />
                    <CheckItem label="Apresentou o app da NIO e suas funcionalidades" field="app_nio_informado" />
                    <CheckItem label="Informou sobre segurança de dados e canais suspeitos" field="seguranca_dados_informada" />
                    <CheckItem label="Informou que equipamento é comodato" field="comodato_informado" />
                    <CheckItem label="Informou multa de R$400 por perda/dano do equipamento" field="multa_equipamento_informada" />
                    <CheckItem label="Informou congelamento de valor até 31/01/2028" field="congelamento_valor_informado" />
                    <CheckItem label="Informou sobre mensagem oficial da NIO com detalhes" field="mensagem_oficial_informada" />
                    <CheckItem label="Informou canais de atendimento (0800, WhatsApp)" field="canais_atendimento_informados" />
                    <CheckItem label='Solicitou confirmação com "OK" ou "SIM"' field="confirmacao_ok_sim" />
                    <CheckItem label="Confirmou data do agendamento" field="agendamento_confirmado" />
                    <CheckItem label="Perguntou se há dúvidas" field="duvidas_perguntadas" />
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
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar Checklist"}
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
