import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbbhllhgbachkzvpxvam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYmhsbGhnYmFjaGt6dnB4dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Njk1NjksImV4cCI6MjA3MzQ0NTU2OX0.l--gaQSJ5hPnJyZOC9-QsRRQjr-hnsX_WeGSglbNP8E';

// Define types for your database for type-safe queries
export interface Database {
  public: {
    Tables: {
      auth_token: {
        Row: {
          id: number
          created_at: string
          token: string
          status: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          token: string
          status?: string | null
        }
        Update: {
          token?: string
          status?: string | null
        }
        Relationships: []
      }
      users: {
        Row: { // The data coming from the database
          id: string
          created_at: string
          full_name: string | null
          email: string
          phone: string
          // FIX: Use string literals instead of circular enum reference for correct type inference
          role: 'admin' | 'user'
          // FIX: Use string literals to include 'subscription' status
          status: 'pending_payment' | 'trial' | 'inactive' | 'lifetime' | 'admin' | 'subscription'
          api_key: string | null
          avatar_url: string | null
          subscription_expiry: string | null
          webhook_url: string | null
        }
        Insert: { // The data you can insert
          id?: string // id is auto-generated
          created_at?: string
          full_name?: string | null
          email: string
          phone: string
          // FIX: Use string literals to include 'subscription' status
          role?: 'admin' | 'user'
          // FIX: Use string literals to include 'subscription' status
          status?: 'pending_payment' | 'trial' | 'inactive' | 'lifetime' | 'admin' | 'subscription'
          api_key?: string | null
          avatar_url?: string | null
          subscription_expiry?: string | null
          webhook_url?: string | null
        }
        Update: { // The data you can update
          full_name?: string | null
          email?: string
          phone?: string
          // FIX: Use string literals to include 'subscription' status
          role?: 'admin' | 'user'
          // FIX: Use string literals to include 'subscription' status
          status?: 'pending_payment' | 'trial' | 'inactive' | 'lifetime' | 'admin' | 'subscription'
          api_key?: string | null
          avatar_url?: string | null
          subscription_expiry?: string | null
          webhook_url?: string | null
        }
        // FIX: Added Relationships array to fix Supabase type inference issues, resolving 'never' types.
        Relationships: []
      }
      activity_log: {
        Row: {
          id: number
          created_at: string
          user_id: string
          activity_type: string
          username: string | null
          email: string | null
          // New structured fields
          model: string | null
          prompt: string | null
          output: string | null
          token_count: number | null
          status: string | null
          error_message: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          username: string
          email: string
          activity_type: string
          // New structured fields (all optional)
          model?: string | null
          prompt?: string | null
          output?: string | null
          token_count?: number | null
          status?: string | null
          error_message?: string | null
        }
        Update: {}
        Relationships: [
          {
            foreignKeyName: 'activity_log_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      prompt_viral_my: {
        Row: {
          id: number
          created_at: string
          title: string
          author: string
          image_url: string
          prompt: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          author: string
          image_url: string
          prompt: string
        }
        Update: {
          title?: string
          author?: string
          image_url?: string
          prompt?: string
        }
        Relationships: []
      }
      generated_api_keys: {
        Row: {
          id: number
          created_at: string
          api_key: string
          claimed_by_user_id: string | null
          claimed_by_username: string | null
          claimed_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          api_key: string
          claimed_by_user_id?: string | null
          claimed_by_username?: string | null
          claimed_at?: string | null
        }
        Update: {
          claimed_by_user_id?: string | null
          claimed_by_username?: string | null
          claimed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'generated_api_keys_claimed_by_user_id_fkey'
            columns: ['claimed_by_user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    // FIX: Added Views and CompositeTypes to complete the Database type definition and fix 'never' type errors.
    Views: {}
    Functions: {}
    Enums: {
      user_role: 'admin' | 'user'
      user_status: 'pending_payment' | 'trial' | 'inactive' | 'lifetime' | 'admin' | 'subscription'
    }
    CompositeTypes: {}
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
