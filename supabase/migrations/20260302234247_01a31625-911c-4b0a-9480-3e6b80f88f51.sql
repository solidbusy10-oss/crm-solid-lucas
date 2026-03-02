
-- Add extra fields to pos_venda
ALTER TABLE public.pos_venda
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS telefone_contato text,
  ADD COLUMN IF NOT EXISTS email_cliente text,
  ADD COLUMN IF NOT EXISTS plano_contratado text,
  ADD COLUMN IF NOT EXISTS valor_mensalidade text,
  ADD COLUMN IF NOT EXISTS audio_auditoria_url text;

-- Create checklist table for pos-venda team
CREATE TABLE public.pos_venda_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_venda_id uuid NOT NULL REFERENCES public.pos_venda(id) ON DELETE CASCADE,
  respondido_por uuid NOT NULL,
  -- Questionário pós-venda
  endereco_correto boolean DEFAULT false,
  confirmou_dados boolean DEFAULT false,
  passou_info_plano boolean DEFAULT false,
  fez_upsell boolean DEFAULT false,
  passou_confianca boolean DEFAULT false,
  entonacao_voz_boa boolean DEFAULT false,
  -- Auditoria checklist
  nome_completo_confirmado boolean DEFAULT false,
  cpf_confirmado boolean DEFAULT false,
  telefone_confirmado boolean DEFAULT false,
  endereco_confirmado boolean DEFAULT false,
  plano_informado boolean DEFAULT false,
  valor_informado boolean DEFAULT false,
  fidelidade_informada boolean DEFAULT false,
  primeira_fatura_informada boolean DEFAULT false,
  app_nio_informado boolean DEFAULT false,
  seguranca_dados_informada boolean DEFAULT false,
  comodato_informado boolean DEFAULT false,
  multa_equipamento_informada boolean DEFAULT false,
  congelamento_valor_informado boolean DEFAULT false,
  mensagem_oficial_informada boolean DEFAULT false,
  canais_atendimento_informados boolean DEFAULT false,
  confirmacao_ok_sim boolean DEFAULT false,
  agendamento_confirmado boolean DEFAULT false,
  duvidas_perguntadas boolean DEFAULT false,
  -- Observação
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pos_venda_id)
);

ALTER TABLE public.pos_venda_checklist ENABLE ROW LEVEL SECURITY;

-- All authenticated can view checklists
CREATE POLICY "Authenticated users can view checklists"
ON public.pos_venda_checklist FOR SELECT TO authenticated
USING (true);

-- Gestores and the respondent can insert
CREATE POLICY "Authenticated users can insert checklists"
ON public.pos_venda_checklist FOR INSERT TO authenticated
WITH CHECK (auth.uid() = respondido_por);

-- Gestores and the respondent can update
CREATE POLICY "Authenticated users can update checklists"
ON public.pos_venda_checklist FOR UPDATE TO authenticated
USING (auth.uid() = respondido_por OR has_role(auth.uid(), 'coordenador'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role));

-- Create storage bucket for audit audio
INSERT INTO storage.buckets (id, name, public) VALUES ('audit-audio', 'audit-audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload audit audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'audit-audio');

CREATE POLICY "Anyone can view audit audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'audit-audio');

-- Trigger for updated_at
CREATE TRIGGER update_pos_venda_checklist_updated_at
BEFORE UPDATE ON public.pos_venda_checklist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
