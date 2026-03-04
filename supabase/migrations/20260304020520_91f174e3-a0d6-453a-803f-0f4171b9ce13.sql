ALTER TABLE public.pos_venda_checklist
  ADD COLUMN ciclo_fatura_explicado boolean DEFAULT false,
  ADD COLUMN acesso_fatura_explicado boolean DEFAULT false,
  ADD COLUMN ciclo_fatura_enviado boolean DEFAULT false;