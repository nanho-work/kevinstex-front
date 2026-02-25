'use client'

import { Dispatch, SetStateAction } from 'react'
import { PersonTaxInput } from '@/service/taxCalculator'
import BusinessCard from './BusinessCard'

interface Props {
  businesses: PersonTaxInput['businesses']
  setBusinesses: Dispatch<
    SetStateAction<PersonTaxInput['businesses']>
  >
}

export default function BusinessSection({
  businesses,
  setBusinesses,
}: Props) {
  const addBusiness = () => {
    if (businesses.length >= 4) return
    setBusinesses([
      ...businesses,
      {
        industryCode: '',
        grossIncome: 0,
        expenseMode: 'RATE',
        expenseRate: 0,
        expenseItems: {},
      },
    ])
  }

  const removeBusiness = (index: number) => {
    setBusinesses(businesses.filter((_, i) => i !== index))
  }

  const updateBusiness = (index: number, updated: any) => {
    const copy = [...businesses]
    copy[index] = { ...copy[index], ...updated }
    setBusinesses(copy)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">사업장 입력</h2>

      {businesses.map((b, i) => (
        <BusinessCard
          key={i}
          index={i}
          data={b}
          onChange={(val) => updateBusiness(i, val)}
          onRemove={() => removeBusiness(i)}
          canRemove={businesses.length > 1}
        />
      ))}

      {businesses.length < 4 && (
        <button
          onClick={addBusiness}
          className="px-4 py-2 bg-black text-white rounded"
        >
          + 사업장 추가
        </button>
      )}
    </div>
  )
}