import { TransactionProduct } from '@/types/transaction/transactionTypes'
import React from 'react'

function ProductTransactionList({ item }: { item: TransactionProduct }) {
  const { productDetails, quantity, price, discount, finalPrice } = item;
  const basePrice = price; // harga asli per item
  const activePrice = price - discount; // harga setelah diskon (per item)
  return (
    <div>ProductTransactionList</div>
  )
}

export default ProductTransactionList