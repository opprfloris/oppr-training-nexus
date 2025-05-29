export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      document_folders: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          parent_folder_id: string | null
          path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          parent_folder_id?: string | null
          path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          parent_folder_id?: string | null
          path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_folders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          created_by: string
          display_name: string
          file_path: string
          file_size: number
          file_type: string
          folder_id: string | null
          id: string
          metadata: Json | null
          mime_type: string
          original_name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          display_name: string
          file_path: string
          file_size: number
          file_type: string
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          display_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_images: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          file_path: string
          file_size: number
          file_type: string
          height: number | null
          id: string
          name: string
          updated_at: string
          usage_count: number
          width: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          file_path: string
          file_size: number
          file_type: string
          height?: number | null
          id?: string
          name: string
          updated_at?: string
          usage_count?: number
          width?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          height?: number | null
          id?: string
          name?: string
          updated_at?: string
          usage_count?: number
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_images_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_qr_entities: {
        Row: {
          brand: string | null
          created_at: string
          created_by: string
          id: string
          location_description: string | null
          machine_id: string
          machine_type: string | null
          qr_identifier: string
          qr_name: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          brand?: string | null
          created_at?: string
          created_by: string
          id?: string
          location_description?: string | null
          machine_id: string
          machine_type?: string | null
          qr_identifier: string
          qr_name: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          brand?: string | null
          created_at?: string
          created_by?: string
          id?: string
          location_description?: string | null
          machine_id?: string
          machine_type?: string | null
          qr_identifier?: string
          qr_name?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "machine_qr_entities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_definition_versions: {
        Row: {
          created_at: string | null
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["training_definition_status"]
          steps_json: Json
          training_definition_id: string
          version_notes: string | null
          version_number: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["training_definition_status"]
          steps_json?: Json
          training_definition_id: string
          version_notes?: string | null
          version_number: string
        }
        Update: {
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["training_definition_status"]
          steps_json?: Json
          training_definition_id?: string
          version_notes?: string | null
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_definition_versions_training_definition_id_fkey"
            columns: ["training_definition_id"]
            isOneToOne: false
            referencedRelation: "training_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_definitions: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_project_collaborators: {
        Row: {
          assigned_at: string
          assigned_by: string
          collaborator_id: string
          id: string
          training_project_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          collaborator_id: string
          id?: string
          training_project_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          collaborator_id?: string
          id?: string
          training_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_project_collaborators_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_collaborators_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_collaborators_training_project_id_fkey"
            columns: ["training_project_id"]
            isOneToOne: false
            referencedRelation: "training_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      training_project_content: {
        Row: {
          created_at: string
          id: string
          marker_id: string
          sequence_order: number
          training_definition_version_id: string | null
          training_project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          marker_id: string
          sequence_order: number
          training_definition_version_id?: string | null
          training_project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          marker_id?: string
          sequence_order?: number
          training_definition_version_id?: string | null
          training_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_project_content_marker_id_fkey"
            columns: ["marker_id"]
            isOneToOne: false
            referencedRelation: "training_project_markers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_content_training_definition_version_id_fkey"
            columns: ["training_definition_version_id"]
            isOneToOne: false
            referencedRelation: "training_definition_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_content_training_project_id_fkey"
            columns: ["training_project_id"]
            isOneToOne: false
            referencedRelation: "training_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      training_project_markers: {
        Row: {
          created_at: string
          id: string
          machine_qr_entity_id: string
          pin_number: number
          sequence_order: number | null
          training_project_id: string
          x_position: number
          y_position: number
        }
        Insert: {
          created_at?: string
          id?: string
          machine_qr_entity_id: string
          pin_number: number
          sequence_order?: number | null
          training_project_id: string
          x_position: number
          y_position: number
        }
        Update: {
          created_at?: string
          id?: string
          machine_qr_entity_id?: string
          pin_number?: number
          sequence_order?: number | null
          training_project_id?: string
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_project_markers_machine_qr_entity_id_fkey"
            columns: ["machine_qr_entity_id"]
            isOneToOne: false
            referencedRelation: "machine_qr_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_markers_training_project_id_fkey"
            columns: ["training_project_id"]
            isOneToOne: false
            referencedRelation: "training_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      training_project_operator_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          operator_id: string
          training_project_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          operator_id: string
          training_project_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          operator_id?: string
          training_project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_project_operator_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_operator_assignments_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_project_operator_assignments_training_project_id_fkey"
            columns: ["training_project_id"]
            isOneToOne: false
            referencedRelation: "training_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      training_projects: {
        Row: {
          color_code: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          floor_plan_image_id: string | null
          icon: string | null
          id: string
          max_retake_attempts: number | null
          name: string
          pass_fail_threshold: number | null
          project_id: string
          recommended_completion_time: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          floor_plan_image_id?: string | null
          icon?: string | null
          id?: string
          max_retake_attempts?: number | null
          name: string
          pass_fail_threshold?: number | null
          project_id: string
          recommended_completion_time?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          floor_plan_image_id?: string | null
          icon?: string | null
          id?: string
          max_retake_attempts?: number | null
          name?: string
          pass_fail_threshold?: number | null
          project_id?: string
          recommended_completion_time?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_projects_floor_plan_image_id_fkey"
            columns: ["floor_plan_image_id"]
            isOneToOne: false
            referencedRelation: "floor_plan_images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_project_id: {
        Args: { prefix?: string }
        Returns: string
      }
      generate_qr_identifier: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      question_type:
        | "text_input"
        | "numerical_input"
        | "multiple_choice"
        | "voice_input"
      training_definition_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      question_type: [
        "text_input",
        "numerical_input",
        "multiple_choice",
        "voice_input",
      ],
      training_definition_status: ["draft", "published", "archived"],
    },
  },
} as const
