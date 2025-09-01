import Image from 'next/image'
import React from 'react'

function EmptyCart() {
  return (
    <section className='container mx-auto px-4'>
        <Image
          src="/emptyCart.svg"
          alt="Empty Cart"
          width={350}
          height={350}
          className="mx-auto"
        />
        <div className="text-center">
          <h2 className="text-2xl text-secondary">Your Cart is Empty</h2>
          <p className="text-secondary">Add items to your cart to get started.</p>
        </div>
    </section>
  )
}

export default EmptyCart