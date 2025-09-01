import React from "react";
import { PiTrashBold } from "react-icons/pi";

const CartRow = () => {
  return (
    <tr>
      <td>
        <div className="avatar">
          <div className="mask mask-squircle h-12 w-12">
            <img
              src="https://img.daisyui.com/images/profile/demo/2@94.webp"
              alt="Avatar Tailwind CSS Component"
            />
          </div>
        </div>
      </td>
      <td>Nissin Cracker</td>
      <td>Quantity</td>
      <td> Rp 100.000</td>
      <td> Rp 200.000</td>
      <td className="text-red-700">
        <PiTrashBold />
      </td>
    </tr>
  );
};

export default CartRow;
