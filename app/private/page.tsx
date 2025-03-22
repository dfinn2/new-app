import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()
  
  // Get user authentication data
  const { data: authData, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authData?.user) {
    console.log("Authentication error:", authError)
    redirect('/login')
  }
  
  console.log("Auth user data:", authData.user)
  
  // Get user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()
  
  console.log("User profile data:", profileData)
  if (profileError) console.log("Profile error:", profileError)
  
  // Get user purchases
  const { data: purchasesData, error: purchasesError } = await supabase
    .from('document_purchases')
    .select('*')
    .eq('user_id', authData.user.id)
  
  console.log("User purchases data:", purchasesData)
  if (purchasesError) console.log("Purchases error:", purchasesError)
  
  // Get purchase items through user purchases
  let purchaseItemsData = null;
  let purchaseItemsError = null;  
  
  if (purchasesData && purchasesData.length > 0) {
    // Get the purchase IDs
    const purchaseIds = purchasesData.map(purchase => purchase.id);
    
    // Query purchase items using purchase IDs
    const { data, error } = await supabase
      .from('purchase_items')
      .select('*')
      .in('purchase_id', purchaseIds);
    
    purchaseItemsData = data;
    purchaseItemsError = error;
  }
  
  console.log("Purchase items data:", purchaseItemsData)
  if (purchaseItemsError) console.log("Purchase items error:", purchaseItemsError)
  
  // Get documents data
  const { data: documentsData, error: documentsError } = await supabase
    .from('products')
    .select('*')
  
  console.log("Documents data:", documentsData)
  if (documentsError) console.log("Documents error:", documentsError)

  return (
    <div>
      <p>Hello {authData.user.email}</p>
      <p>Your Display Name: {profileData?.display_name || "not provided"}</p>
      <p>Account created: {authData.user?.created_at ? new Date(authData.user.created_at).toLocaleDateString() : "Unknown"}</p>
      <p>Your purchases: {purchasesData?.length || 0}</p>
      <p>Your documents: {documentsData?.length || 0}</p>
      <p>Purchase items: {purchaseItemsData?.length || 0}</p>
      <p>Total paid: { purchasesData?.reduce((total, purchase) => total + purchase.total_amount, 0) || 0 }</p>
      
      <h2 className="mt-4">Debug information:</h2>
      <p>Check the server console logs for complete data output</p>
    </div>
  )
}