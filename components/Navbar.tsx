import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { FileCheck2 } from "lucide-react";

const Navbar = async () => {
  const session = await auth();

  return (
    <>
      <header className="px-5 py-3 bg- shadow-sm font-work-sans">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
          </Link>
          <div className="flex items-center gap-15 text-black">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <div className="bg-pine-cone-300">
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-red p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            />
                            <FileCheck2 size={96} />
                            <span className="mb-2 mt-4 text-lg font-medium">
                              shadcn/ui
                            </span>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components built with Radix
                              UI and Tailwind CSS.
                            </p>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <Link href="/docs" title="Introduction" className="hover:bg-accent">
                        Re-usable components built using Radix UI and Tailwind
                        CSS.
                      </Link>
                      <Link href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </Link>
                      <Link
                        href="/docs/primitives/typography"
                        title="Typography"
                      >
                        Styles for headings, paragraphs, lists...etc
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      BlahBlah
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      BlahBlah
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-3 text-black">
            {session && session?.user ? (
              <>
                <Link href="/startup/create">
                  <Button variant="ghost" type="submit">
                    Create
                  </Button>
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button
                    variant="ghost"
                    type="submit"
                    className="max-sm:hidden"
                  >
                    Logout
                  </Button>
                </form>

                <Link href={`/user/${session?.user?.id}`}>
                  <span className="text-black">
                    {session?.user?.name || ""}
                  </span>
                </Link>
              </>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo: "/" });
                }}
              >
                <Button variant="ghost" type="submit">
                  Login
                </Button>
              </form>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
