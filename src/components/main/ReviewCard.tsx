// src/components/ReviewCard.tsx
// 리뷰 케러셀 카드 
'use client'

import { FC } from 'react'
import { Star } from 'lucide-react'

interface ReviewCardProps {
    id: number
    customer_name: string
    comment: string
    rating: number
    created_at: string
    category: string
}

const ReviewCard: FC<ReviewCardProps> = ({ id, customer_name, comment, rating, created_at, category }) => {
    return (
        <div className="min-w-[280px] max-w-sm bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-blue-900">{customer_name}</p>
                    <p className="text-xs text-gray-500">{category}</p>
                </div>
                <span className="text-xs text-gray-500">{created_at.split('T')[0]}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3">{comment}</p>
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReviewCard