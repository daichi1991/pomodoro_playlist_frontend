"use client"

import { fetchLogin, getTokens } from "@/app/apis/pomodoro"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthUserContext } from "../../context/authUserContext"

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    userImage,
    setUserImage,
    userName,
    setUserName,
    getUserProfile,
    setIsAuthenticated,
  } = useContext(AuthUserContext)
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)
  const insideRef = useRef<HTMLDivElement>(null)

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen)
  }

  const handleSignin = () => {
    fetchLogin().then((url) => {
      router.push(url)
    })
  }

  const handleSignout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setIsLogin(false)
    setUserImage("")
    setUserName("")
    router.push("/")
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const handleGetTokens = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")
      const state = url.searchParams.get("state")
      if (!code || !state) {
        return
      }
      await getTokens()
      router.push("/")
      getUserProfile()
      setIsLogin(true)
      setIsAuthenticated(true)
    }
    handleGetTokens()
  }, [])

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsLogin(true)
    }
  }, [isLogin])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        insideRef.current &&
        !insideRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  }, [insideRef])

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                {/* <!--
                Icon when menu is closed.

                Menu open: "hidden", Menu closed: "block"
              --> */}
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                {/* <!--
                Icon when menu is open.

                Menu open: "block", Menu closed: "hidden"
              --> */}
                <svg
                  className="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                {/* <svg className="h-8 w-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                <image
                  xlinkHref="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  x="0"
                  y="0"
                  height="100%"
                  width="100%"
                  />
                </svg> */}
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  <a
                    href="/dashboard"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div ref={insideRef}>
                  <button
                    onClick={handleMenuOpen}
                    type="button"
                    className="relative flex rounded-full text-gray-200 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {userImage ? (
                      <svg
                        className="w-8 h-8 rounded-full"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <image
                          xlinkHref={userImage}
                          x="0"
                          y="0"
                          height="100%"
                          width="100%"
                        />
                      </svg>
                    ) : (
                      <span className="i-material-symbols-account-circle w-8 h-8"></span>
                    )}
                  </button>
                </div>

                {/* <!--
                Dropdown menu, show/hide based on menu state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              --> */}
                {menuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    ref={insideRef}
                  >
                    {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                    {!isLogin ? (
                      <div
                        onClick={handleSignin}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                        role="menuitem"
                        id="user-menu-item-0"
                      >
                        ログイン
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={handleSignout}
                          className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                          role="menuitem"
                          id="user-menu-item-2"
                        >
                          ログアウト
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      </nav>
    </>
  )
}
