
CREATE TABLE public.pos_venda (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpf_cliente text NOT NULL,
  numero_os text NOT NULL,
  vendedor_id uuid NOT NULL,
  vendedor_nome text NOT NULL,
  status text NOT NULL DEFAULT 'Pendente',
  status_agendamento text NOT NULL DEFAULT 'Não agendado',
  pendencia text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pos_venda ENABLE ROW LEVEL SECURITY;

-- Vendedores veem apenas suas vendas
CREATE POLICY "Vendedores veem suas vendas"
ON public.pos_venda FOR SELECT
TO authenticated
USING (
  auth.uid() = vendedor_id
  OR public.has_role(auth.uid(), 'coordenador')
  OR public.has_role(auth.uid(), 'supervisor')
);

-- Coordenadores e supervisores podem inserir
CREATE POLICY "Gestores podem inserir"
ON public.pos_venda FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'coordenador')
  OR public.has_role(auth.uid(), 'supervisor')
);

-- Gestores podem atualizar
CREATE POLICY "Gestores podem atualizar"
ON public.pos_venda FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'coordenador')
  OR public.has_role(auth.uid(), 'supervisor')
);

-- Trigger updated_at
CREATE TRIGGER update_pos_venda_updated_at
BEFORE UPDATE ON public.pos_venda
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
