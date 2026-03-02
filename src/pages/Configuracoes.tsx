import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, User, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Configuracoes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles").select("*").eq("user_id", user.id).single();
      if (profile) {
        setDisplayName(profile.display_name || "");
        setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Erro ao enviar foto.");
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const url = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("user_id", userId);

    if (updateError) {
      toast.error("Erro ao salvar foto no perfil.");
    } else {
      setAvatarUrl(url);
      toast.success("Foto atualizada!");
    }
    setUploadingAvatar(false);
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error("Nome não pode ser vazio.");
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao salvar nome.");
    } else {
      toast.success("Nome atualizado!");
    }
    setSaving(false);
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      toast.error("Email não pode ser vazio.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email de confirmação enviado para o novo endereço!");
    }
    setSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha atualizada!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/perfil")}
            className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
          </button>
          <h1 className="text-xl font-bold font-display text-foreground">Configurações</h1>
        </div>

        {/* Avatar */}
        <div className="glass-card rounded-xl p-6 mb-6 glow-primary">
          <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            Foto de Perfil
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold font-display text-primary">
                    {displayName.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold">Alterar foto</p>
              <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP. Máx 5MB.</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="glass-card rounded-xl p-6 mb-6 glow-primary">
          <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Nome
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="displayName" className="text-xs text-muted-foreground">Nome completo</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 bg-background/50 border-border/50"
                placeholder="Seu nome completo"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar nome
            </Button>
          </div>
        </div>

        {/* Email */}
        <div className="glass-card rounded-xl p-6 mb-6 glow-primary">
          <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Email
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">Endereço de email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-background/50 border-border/50"
              />
            </div>
            <Button onClick={handleUpdateEmail} disabled={saving} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Atualizar email
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="glass-card rounded-xl p-6 glow-primary">
          <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Senha
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="newPassword" className="text-xs text-muted-foreground">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 bg-background/50 border-border/50"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-background/50 border-border/50"
                placeholder="Repita a nova senha"
              />
            </div>
            <Button onClick={handleUpdatePassword} disabled={saving} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Atualizar senha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
