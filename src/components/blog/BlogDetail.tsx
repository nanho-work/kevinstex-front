'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPostResponse } from '@/types/blog';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type BlogDetailProps = {
    post: BlogPostResponse;
};

export default function BlogDetail({ post }: BlogDetailProps) {
    const [open, setOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState<{ src: string }[]>([]);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
            const allImages = Array.from(e.currentTarget.querySelectorAll('img')).map((img) => ({
                src: img.src,
            }));
            const clickedIndex = allImages.findIndex((img) => img.src === target.src);
            setImages(allImages);
            setImageIndex(clickedIndex);
            setOpen(true);
        }
    };

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
            <div className="prose prose-neutral max-w-none mt-8" onClick={handleImageClick}>
                <div dangerouslySetInnerHTML={{ __html: post.content_md }} />
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={images}
                index={imageIndex}
                controller={{ closeOnBackdropClick: true }}
                styles={{
                    container: { backgroundColor: 'rgba(0,0,0,0.3)' },
                    slide: {
                        transform: 'scale(1.3)',
                        transition: 'transform 0.3s ease-in-out',
                    },
                }}
            />
        </div>
    );
}