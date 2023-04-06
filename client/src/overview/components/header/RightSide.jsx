import React from 'react'
import { useLayoutEffect, useState } from 'react'
import OldFaithfulLastEruption from './OldFaithfulLastEruption.jsx'

export default function RightSide ({ handleSearch, cartLength, product }) {

  return (
    <div className="flex gap-2">
      <h3 className='italic pr-2 justify-self-end text-red-900 font-semibold'>
        Product ID: {product.id}
      </h3>
      <div className="flex-1 justify-self-end form-control">
        <input type="text" placeholder="Search" className="input input-bordered" onKeyDown={handleSearch} />
      </div>
      {/* <div className="dropdown dropdown-end"> */}

        <div className="indicator">
          {(cartLength > 0) && <span className="indicator-item indicator-bottom badge badge-secondary right-[20%] bg-green-800 border-green-800">{cartLength}</span>}
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="/images/favicon/favicon.ico" />

            </div>
          </label>

          {/* <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div> */}
        </div>


    </div>
  )
}