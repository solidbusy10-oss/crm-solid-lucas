export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      pos_venda: {
        Row: {
          audio_auditoria_url: string | null
          cpf_cliente: string
          created_at: string
          email_cliente: string | null
          endereco: string | null
          id: string
          numero_os: string
          pendencia: string | null
          plano_contratado: string | null
          status: string
          status_agendamento: string
          telefone_contato: string | null
          updated_at: string
          valor_mensalidade: string | null
          vendedor_id: string
          vendedor_nome: string
        }
        Insert: {
          audio_auditoria_url?: string | null
          cpf_cliente: string
          created_at?: string
          email_cliente?: string | null
          endereco?: string | null
          id?: string
          numero_os: string
          pendencia?: string | null
          plano_contratado?: string | null
          status?: string
          status_agendamento?: string
          telefone_contato?: string | null
          updated_at?: string
          valor_mensalidade?: string | null
          vendedor_id: string
          vendedor_nome: string
        }
        Update: {
          audio_auditoria_url?: string | null
          cpf_cliente?: string
          created_at?: string
          email_cliente?: string | null
          endereco?: string | null
          id?: string
          numero_os?: string
          pendencia?: string | null
          plano_contratado?: string | null
          status?: string
          status_agendamento?: string
          telefone_contato?: string | null
          updated_at?: string
          valor_mensalidade?: string | null
          vendedor_id?: string
          vendedor_nome?: string
        }
        Relationships: []
      }
      pos_venda_checklist: {
        Row: {
          acesso_fatura_explicado: boolean | null
          agendamento_confirmado: boolean | null
          app_nio_informado: boolean | null
          canais_atendimento_informados: boolean | null
          ciclo_fatura_enviado: boolean | null
          ciclo_fatura_explicado: boolean | null
          comodato_informado: boolean | null
          confirmacao_ok_sim: boolean | null
          confirmou_dados: boolean | null
          congelamento_valor_informado: boolean | null
          cpf_confirmado: boolean | null
          created_at: string
          duvidas_perguntadas: boolean | null
          endereco_confirmado: boolean | null
          endereco_correto: boolean | null
          entonacao_voz_boa: boolean | null
          fez_upsell: boolean | null
          fidelidade_informada: boolean | null
          id: string
          mensagem_oficial_informada: boolean | null
          multa_equipamento_informada: boolean | null
          nome_completo_confirmado: boolean | null
          observacao: string | null
          passou_confianca: boolean | null
          passou_info_plano: boolean | null
          plano_informado: boolean | null
          pos_venda_id: string
          primeira_fatura_informada: boolean | null
          respondido_por: string
          seguranca_dados_informada: boolean | null
          telefone_confirmado: boolean | null
          updated_at: string
          valor_informado: boolean | null
        }
        Insert: {
          acesso_fatura_explicado?: boolean | null
          agendamento_confirmado?: boolean | null
          app_nio_informado?: boolean | null
          canais_atendimento_informados?: boolean | null
          ciclo_fatura_enviado?: boolean | null
          ciclo_fatura_explicado?: boolean | null
          comodato_informado?: boolean | null
          confirmacao_ok_sim?: boolean | null
          confirmou_dados?: boolean | null
          congelamento_valor_informado?: boolean | null
          cpf_confirmado?: boolean | null
          created_at?: string
          duvidas_perguntadas?: boolean | null
          endereco_confirmado?: boolean | null
          endereco_correto?: boolean | null
          entonacao_voz_boa?: boolean | null
          fez_upsell?: boolean | null
          fidelidade_informada?: boolean | null
          id?: string
          mensagem_oficial_informada?: boolean | null
          multa_equipamento_informada?: boolean | null
          nome_completo_confirmado?: boolean | null
          observacao?: string | null
          passou_confianca?: boolean | null
          passou_info_plano?: boolean | null
          plano_informado?: boolean | null
          pos_venda_id: string
          primeira_fatura_informada?: boolean | null
          respondido_por: string
          seguranca_dados_informada?: boolean | null
          telefone_confirmado?: boolean | null
          updated_at?: string
          valor_informado?: boolean | null
        }
        Update: {
          acesso_fatura_explicado?: boolean | null
          agendamento_confirmado?: boolean | null
          app_nio_informado?: boolean | null
          canais_atendimento_informados?: boolean | null
          ciclo_fatura_enviado?: boolean | null
          ciclo_fatura_explicado?: boolean | null
          comodato_informado?: boolean | null
          confirmacao_ok_sim?: boolean | null
          confirmou_dados?: boolean | null
          congelamento_valor_informado?: boolean | null
          cpf_confirmado?: boolean | null
          created_at?: string
          duvidas_perguntadas?: boolean | null
          endereco_confirmado?: boolean | null
          endereco_correto?: boolean | null
          entonacao_voz_boa?: boolean | null
          fez_upsell?: boolean | null
          fidelidade_informada?: boolean | null
          id?: string
          mensagem_oficial_informada?: boolean | null
          multa_equipamento_informada?: boolean | null
          nome_completo_confirmado?: boolean | null
          observacao?: string | null
          passou_confianca?: boolean | null
          passou_info_plano?: boolean | null
          plano_informado?: boolean | null
          pos_venda_id?: string
          primeira_fatura_informada?: boolean | null
          respondido_por?: string
          seguranca_dados_informada?: boolean | null
          telefone_confirmado?: boolean | null
          updated_at?: string
          valor_informado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_venda_checklist_pos_venda_id_fkey"
            columns: ["pos_venda_id"]
            isOneToOne: true
            referencedRelation: "pos_venda"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          display_name: string | null
          equipe: string | null
          id: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          equipe?: string | null
          id?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          equipe?: string | null
          id?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_indicators: {
        Row: {
          audit_trc: number
          audit_vendas: number
          cg_posvenda: number
          cg_vendas: number
          conv_vendas: number
          created_at: string
          form: number
          id: string
          instalada: number
          perc_instalacao: number
          period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audit_trc?: number
          audit_vendas?: number
          cg_posvenda?: number
          cg_vendas?: number
          conv_vendas?: number
          created_at?: string
          form?: number
          id?: string
          instalada?: number
          perc_instalacao?: number
          period?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audit_trc?: number
          audit_vendas?: number
          cg_posvenda?: number
          cg_vendas?: number
          conv_vendas?: number
          created_at?: string
          form?: number
          id?: string
          instalada?: number
          perc_instalacao?: number
          period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "supervisor" | "coordenador" | "vendedor" | "posvenda"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["supervisor", "coordenador", "vendedor", "posvenda"],
    },
  },
} as const
