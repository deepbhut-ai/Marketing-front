import BrandsEditPage from '@/components/user/pages/BrandsEditPage'
import React from 'react'

const Page = async ({ params }) => {
  const { id } = await params

  return (
    <div>
      <BrandsEditPage brandId={id} />
    </div>
  )
}

export default Page