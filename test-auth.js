import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestAdmin() {
    const email = 'testadmin1@globalairsn.com';
    const password = 'Testpassword123!';
    
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (error) {
        console.log("Auth Error:", error.message);
        return;
    }
    
    const { error: dbError } = await supabase.from('User').insert([{
        id: user.user.id,
        email,
        name: 'Agent Test',
        role: 'ADMIN'
    }]);
    
    if (dbError) {
        console.log("DB Error:", dbError.message);
    } else {
        console.log("Test admin created successfully!");
    }
}

createTestAdmin();
