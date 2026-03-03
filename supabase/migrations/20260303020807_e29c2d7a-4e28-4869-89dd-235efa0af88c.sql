
-- Update pos_venda SELECT policy to include posvenda
DROP POLICY "Vendedores veem suas vendas" ON public.pos_venda;
CREATE POLICY "Vendedores veem suas vendas" ON public.pos_venda
FOR SELECT TO authenticated
USING (auth.uid() = vendedor_id OR has_role(auth.uid(), 'coordenador'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role) OR has_role(auth.uid(), 'posvenda'::app_role));

-- Update pos_venda UPDATE policy to include posvenda
DROP POLICY "Gestores podem atualizar" ON public.pos_venda;
CREATE POLICY "Gestores podem atualizar" ON public.pos_venda
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'coordenador'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role) OR has_role(auth.uid(), 'posvenda'::app_role));

-- Update pos_venda INSERT policy to include posvenda
DROP POLICY "Gestores podem inserir" ON public.pos_venda;
CREATE POLICY "Gestores podem inserir" ON public.pos_venda
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role) OR has_role(auth.uid(), 'posvenda'::app_role));

-- Update pos_venda_checklist UPDATE policy to include posvenda
DROP POLICY "Authenticated users can update checklists" ON public.pos_venda_checklist;
CREATE POLICY "Authenticated users can update checklists" ON public.pos_venda_checklist
FOR UPDATE TO authenticated
USING (auth.uid() = respondido_por OR has_role(auth.uid(), 'coordenador'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role) OR has_role(auth.uid(), 'posvenda'::app_role));
