import Link from "next/link";
import Image from "next/image";
import { createClient } from '@/utils/supabase/server';
import { Button } from "@/components/ui/button";
import GoogleSignInNavButton from "@/components/GoogleSignInNavButton";
import { redirect } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { User } from "@supabase/supabase-js";

const Navbar = async () => {
  // Get the Supabase client
  const supabase = await createClient();
  
  // IMPORTANT: Use getUser() instead of getSession() as recommended by Supabase
  // This authenticates the data by contacting the Supabase Auth server
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <>
      <header className="px-5 py-3 bg-transparent shadow-sm">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
          </Link>
          <div className="flex items-center gap-15 text-black">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Legal Documents Menu Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Legal Documents</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link href="/product/nnn-agreement-cn" className="flex flex-col h-full justify-between p-6 no-underline rounded-md shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-all">
                            <div>
                              <div className="text-sm rounded text-blue-700 bg-blue-100 inline-block px-2 py-1 mb-2">Featured</div>
                              <h3 className="text-lg font-medium mb-2 text-blue-950">NNN Agreement</h3>
                              <p className="text-sm text-gray-600 mb-4">
                                Protect your intellectual property with our comprehensive non-disclosure, non-use, and non-circumvention agreement.
                              </p>
                            </div>
                            <span className="text-sm text-blue-600 flex items-center">
                              Learn more
                              <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      <Link href="/product/oem-agreement" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">OEM Agreements</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Original Equipment Manufacturer agreements for product manufacturing.
                        </p>
                      </Link>
                      
                      <Link href="/product/distribution-agreement" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Distribution Agreements</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Structure and protect your distribution relationships with our templates.
                        </p>
                      </Link>
                      
                      <Link href="/product/licensing-agreement" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Licensing Agreements</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Secure your intellectual property with proper licensing terms.
                        </p>
                      </Link>
                      
                      <Link href="/products/legal-documents" className="absolute bottom-4 right-4 text-sm text-blue-600">
                        View all legal documents →
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* IP Protection Menu Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>IP Protection</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-3 p-6 md:grid-cols-2 lg:w-[600px]">
                      <li className="col-span-2">
                        <div className="text-sm font-medium leading-none mb-3 text-gray-500">INTELLECTUAL PROPERTY</div>
                      </li>
                      <li>
                        <Link href="/product/trademark-registration" className="flex h-full flex-col justify-between rounded-md border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-blue-500">
                          <div>
                            <div className="mb-2 text-base font-medium">Trademark Registration</div>
                            <p className="text-sm text-gray-500">Register your trademark in China with our streamlined process.</p>
                          </div>
                          <div className="mt-4 text-xs text-blue-600">Starting at $499</div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/product/patent-services" className="flex h-full flex-col justify-between rounded-md border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-blue-500">
                          <div>
                            <div className="mb-2 text-base font-medium">Patent Services</div>
                            <p className="text-sm text-gray-500">Protect your inventions with our comprehensive patent services.</p>
                          </div>
                          <div className="mt-4 text-xs text-blue-600">Starting at $899</div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/product/copyright-registration" className="flex h-full flex-col justify-between rounded-md border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-blue-500">
                          <div>
                            <div className="mb-2 text-base font-medium">Copyright Registration</div>
                            <p className="text-sm text-gray-500">Secure your creative works with proper copyright protection.</p>
                          </div>
                          <div className="mt-4 text-xs text-blue-600">Starting at $299</div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/product/ip-strategy" className="flex h-full flex-col justify-between rounded-md border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-blue-500">
                          <div>
                            <div className="mb-2 text-base font-medium">IP Strategy Consulting</div>
                            <p className="text-sm text-gray-500">Get expert advice on your intellectual property strategy.</p>
                          </div>
                          <div className="mt-4 text-xs text-blue-600">Starting at $399</div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Menu Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col w-[400px] gap-2 p-4 md:w-[500px] lg:w-[600px]">
                      <li>
                        <Link href="/resources/guides" className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Business Guides</div>
                            <div className="text-xs text-gray-500">Comprehensive guides for doing business in China</div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/resources/templates" className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Free Templates</div>
                            <div className="text-xs text-gray-500">Download free legal templates to get started</div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/resources/blog" className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Blog</div>
                            <div className="text-xs text-gray-500">Latest insights on Chinese business law</div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/resources/webinars" className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Webinars</div>
                            <div className="text-xs text-gray-500">Free educational webinars with legal experts</div>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About Menu Item */}
                <NavigationMenuItem>
                  <Link href="/about" className="flex items-center gap-1 px-4 py-2 text-sm font-medium">
                    About Us
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center gap-3 text-black">
            {user ? (
              // User is logged in - show dashboard link, user info, and logout
              <>
                {/* Dashboard Link - Correctly pointing to /dashboard */}
                <Link href="/dashboard">
                  <Button variant="ghost" type="button">
                    Dashboard
                  </Button>
                </Link>

                {/* User Email/Profile Link */}
                <Link href={`/dashboard`}>
                  <span className="text-black px-2 py-1 rounded hover:bg-gray-200 bg-gray-100">
                    {getUserDisplayName(user)}
                  </span>
                </Link>

                {/* Logout Form */}
                <form action={async () => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect('/')
                }}>
                  <Button
                    variant="outline"
                    type="submit"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              // User is not logged in - show login button and Google sign-in
              <>
                {/* Login Link */}
                <Link href="/login">
                  <Button variant="ghost" type="button">
                    Login
                  </Button>
                </Link>
                
                {/* Sign Up button - only visible when user is not logged in */}
                <Link href="/login?signup=true">
                  <Button variant="default" type="button">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

// Helper function to get user display name
function getUserDisplayName(user: User): string {
  // Try to get name from metadata
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }
  
  // Try to get name from email (everything before @)
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  // Fallback to user ID
  return user.id.substring(0, 8);
}

export default Navbar;