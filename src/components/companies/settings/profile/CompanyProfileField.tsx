type Props = {
  label: string
  value?: string | null
}

export default function CompanyProfileField({ label, value }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500">
        {label}
      </label>
      <p className="mt-1 text-sm font-medium text-neutral-900">
        {value && value.trim().length > 0 ? value : '미작성'}
      </p>
    </div>
  )
}