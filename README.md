# Auth Finalisation
[ ] Change signup page to Supabase Auth - last next-auth component
[ ] remove next-auth as dependency
[ ] add Facebook OAuth
[ ] check email signup Supabase
[ ]




## Repurpose StartupCards
    [ ] repurpose startup cards structure for knowledgbase
    [ ]

## Implement Dashboard
    [ ] Fix and style user profile page
    [ ] style signout button
    [ ] remove signout button from Navbar

## Terms and Conditions
    [ ]
    [ ]

## Bugs / Fixes
    [ ] Put signin requirement before start form - otherwise non-authenticated at checkout.

## Implement New Products
1. Create a form component in components/product-forms/
2. Create a preview component in components/product-previews/
3. Add a template renderer in lib/agreement-templates/
4. Update the product registry in components/product-forms/  
   registry.tsx and components/product-previews/registry.tsx


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




## Required API Keys
AUTH_SECRET= # Added by `npx auth`
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Sanity.io API keys
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=

# Stripe API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=

# Supabase API keys
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_SERVICE_ROLE_KEY=

# PDFShift API Key
PDFSHIFT_API_KEY=

# Mailgun Configuration
MAILGUN_API_KEY=

# Sandbox Mailgun Configuration
MAILGUN_DOMAIN=
EMAIL_FROM_NAME=
EMAIL_FROM_ADDRESS=
INTERNAL_EMAIL=

# Google API keys
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=