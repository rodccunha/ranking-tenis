import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esmxwokylfweaviwkbla.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbXh3b2t5bGZ3ZWF2aXdrYmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzE0OTcsImV4cCI6MjA5NTA0NzQ5N30.6KvJVLrBISXBNmNfAuORHuJbIyuhifxNFru2ev8MZ-c'

export const supabase = createClient(supabaseUrl, supabaseKey)