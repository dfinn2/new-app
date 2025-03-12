import { PRODUCT_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import React from 'react'
import { notFound } from "next/navigation"
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import markdownit from 'markdown-it';

const md = markdownit()

const Page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;
  
const post = await client.fetch(PRODUCT_QUERY, { id });


if(!post) return notFound()

const parsedContent = md.render(post?.content || '');

  return (
    <>
    <section className="hero_container !min-h-[230px]">
        <h1 className="text-3xl">{post.name}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
    </section>
    <section className="section_container">
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
            <div className="flex-between gap-5">
            <Link 
                href={`/user/${post.author?._id}`}
                className="flex items-center mb-3 gap-2"    
            >
            <Image 
                src={post.author.image} 
                alt="avatar" 
                width={64} 
                height={64} 
                className="rounded-full drop-shadow-lg"
            />
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">@{post.author.username}
                </p>
              </div> 
            </Link>

            <p className="category-tag">{post.category}</p>
        </div>
        <h3>Details</h3>
        {parsedContent ? (
            <article
                className="prose max-w-4xl font-work-sans"
                dangerouslySetInnerHTML={{ __html: parsedContent }}

            />
        ) : (
            <p className="no-result">No details provided</p>
        )}
        </div>
    </section>
      
    </>
  )
}

export default Page
