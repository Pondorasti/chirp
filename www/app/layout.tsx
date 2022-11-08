import "./globals.css"
import localFont from "@next/font/local"
import { Inter } from "@next/font/google"
import { AnalyticsWrapper } from "./components/analytics"
import clsx from "clsx"

const satoshi = localFont({
  src: "./Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "400 600",
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      {/* TODO: move inter to html once it starts working */}
      <body className={clsx(inter.variable, "bg-gray-100")}>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
