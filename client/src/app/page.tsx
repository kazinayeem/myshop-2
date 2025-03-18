import FlashSales from '@/components/FlashSales';
import MainHeader from '@/components/MainHeader';
import Categories from '@/components/ViewCategory';
import React from 'react'

export default function page() {
  return <div>
    <MainHeader />
    <FlashSales />
    <Categories />
  </div>;
}
