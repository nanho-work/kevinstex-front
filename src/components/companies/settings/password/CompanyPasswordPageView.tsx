'use client'

import CompanyPasswordHeader from './CompanyPasswordHeader'
import CompanyPasswordForm from './CompanyPasswordForm'
import CompanyPasswordHelpCard from './CompanyPasswordHelpCard'

export default function CompanyPasswordPageView() {
  return (
    <main className="w-full px-4 py-8">
      <div className="w-full">
        <CompanyPasswordHeader />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <CompanyPasswordForm />
          </section>

          <aside className="lg:col-span-1">
            <CompanyPasswordHelpCard />
          </aside>
        </div>
      </div>
    </main>
  )
}