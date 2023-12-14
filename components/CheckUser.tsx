"use client"

import { redirect, usePathname } from "next/navigation"

const CheckUser = ({userData}) => {
const pathName = usePathname()

    if (!userData && pathName != "/profile") {redirect("/profile")}

  return null
}

export default CheckUser