'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPostResponse } from '@/types/blog';

type BlogDetailProps = {
    post: BlogPostResponse;
};

export default function BlogDetail({ post }: BlogDetailProps) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 text-sm mb-4">
                작성일: {format(new Date(post.created_at), 'yyyy-MM-dd')}
            </p>
            {post.thumbnail_url ? (
                <div className="mb-6">
                    <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        width={1200}
                        height={630}
                        className="w-full h-auto rounded-md object-cover"
                        priority
                    />
                </div>
            ) : (
                <div className="mb-6 w-full h-60 rounded-md bg-gray-100 border" />
            )}
            <div className="prose prose-neutral max-w-none mt-8">
                <div dangerouslySetInnerHTML={{ __html: post.content_md }} />
            </div>
        </div>
    );
}