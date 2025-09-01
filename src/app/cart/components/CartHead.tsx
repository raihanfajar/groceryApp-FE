import React from 'react'
import CartRow from './CartRow'

const CartHead = () => {
  return (
    <div className="overflow-x-auto">
        <table className="table">
          <thead className="text-primary font-medium border-b-2">
            <tr>
              <th>Added Items</th>
              <th></th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <CartRow/>
          </tbody>
        </table>
      </div>
  )
}

export default CartHead