'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, BarChart2, Map, Database, Zap, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Component() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Volcano Visualizer
            </Link>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-orange-400">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-900/20 to-black"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Know about Earth&apos;s Fury
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Discover, analyze, and visualize volcanic activity across the globe with real-time data and expert insights.
          </p>
          <Button onClick={() => router.push('/login')} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6">
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-red-900/30 hover:border-red-500/50 transition-all duration-300">
                <div className="text-red-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-orange-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-20 bg-gradient-to-b from-black to-red-900/20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <form className="space-y-6 bg-black/50 backdrop-blur-md p-8 rounded-xl border border-red-900/30">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/50 border-red-900/30 focus:border-red-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-red-900/30 focus:border-red-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-black/50 border-red-900/30 focus:border-red-500 text-white"
                rows={4}
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900/30 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 Volcano Visualizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Realtime Search",
    description: "Instantly search for volcanoes by name, location, or status."
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: "Map Visualization",
    description: "Interactive global map showing volcano locations and activity."
  },
  {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Data Visualization",
    description: "Comprehensive charts and graphs for volcanic data analysis."
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Export Data",
    description: "Download volcano data in various formats for further research."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Real-time Updates",
    description: "Get live updates on volcanic activity around the world."
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Expert Insights",
    description: "Access to volcanologist comments and predictions."
  }
]