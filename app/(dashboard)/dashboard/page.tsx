import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";


export default async function Dashboard() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If no authenticated user, redirect to login
  if (!user || error) {
    redirect("/login");
  }
  
  const userId = user.id;
  
  // Fetch user profile data
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, email')
    .eq('id', userId)
    .single();
  
  // Fetch user purchases with document details
  const { data: purchases } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      stripe_payment_id,
      payment_status,
      generations_used,
      product_name,
      stripe_session_id,
      created_at,
      updated_at,
      documents:product_db (
        name,
        base_price,
        description,
        file_path,)
    `)
    .eq('user_id', userId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {userProfile?.display_name || user.user_metadata?.name || "Not provided"}</p>
          <p><span className="font-medium">Email:</span> {userProfile?.email || user.email}</p>
          <p><span className="font-medium">Member since:</span> {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : new Date(user.created_at).toLocaleDateString()}</p>
          {/* Logout Form */}
                          <form action={async () => {
                            'use server'
                            const supabase = await createClient()
                            await supabase.auth.signOut()
                            redirect('/')
                          }}>
                            <Button
                              variant="standard"
                              type="submit"
                              className=" hover:bg-red-50"
                            >
                              Sign Out
                            </Button>
                          </form>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Purchased Documents</h2>
        
        {purchases && purchases.length > 0 ? (
          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded p-4">
                <h3 className="font-medium">{purchase.product_name?.title || "Untitled Document"}</h3>
                <p className="text-gray-600 text-sm mb-2">{purchase.documents?.description || "No description"}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Purchased on: {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : 'Unknown'} |  
                    Price: ${((purchase.documents?.price || 0) / 100).toFixed(2)}
                  </p>
                  {purchase.documents?.file_path && (
                    <a 
                      href={purchase.documents.file_path} 
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven&apos;t purchased any documents yet.</p>
        )}
      </div>
    </div>
  );
}