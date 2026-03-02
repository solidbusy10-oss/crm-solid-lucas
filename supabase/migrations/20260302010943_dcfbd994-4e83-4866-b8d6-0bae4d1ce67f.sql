
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  cargo TEXT DEFAULT 'Vendedor',
  equipe TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seller indicators table
CREATE TABLE public.seller_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  -- Vendas indicators
  form INT NOT NULL DEFAULT 0,
  cg_vendas INT NOT NULL DEFAULT 0,
  conv_vendas NUMERIC(5,2) NOT NULL DEFAULT 0,
  audit_vendas NUMERIC(5,2) NOT NULL DEFAULT 0,
  audit_trc NUMERIC(5,2) NOT NULL DEFAULT 0,
  -- Pós-venda indicators
  cg_posvenda INT NOT NULL DEFAULT 0,
  instalada INT NOT NULL DEFAULT 0,
  perc_instalacao NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, period)
);

ALTER TABLE public.seller_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own indicators"
  ON public.seller_indicators FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own indicators"
  ON public.seller_indicators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own indicators"
  ON public.seller_indicators FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_seller_indicators_updated_at
  BEFORE UPDATE ON public.seller_indicators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
