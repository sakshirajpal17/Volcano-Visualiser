'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import type { VolcanoEvent } from "@/types/volcano"
import { useDebounce } from 'use-debounce'
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<VolcanoEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [debouncedQuery] = useDebounce(searchQuery, 500)
  const router = useRouter();

  async function searchVolcanoes(query: string) {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.events)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    searchVolcanoes(debouncedQuery)
  }, [debouncedQuery])

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col items-center"
      style={{
        backgroundImage: "url('https://images6.alphacoders.com/435/435617.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Search Any Volcano
        </h1>
        <p className="text-xl text-white/90 mb-4">
          Explore our comprehensive database of volcanic events
        </p>
        <p className="text-sm text-white/80 mb-8">
          Search by name, location, type, or year (e.g., &ldquo;1883&rdquo; or &ldquo;1800-1900&rdquo;)
        </p>
      </div>

      <div className="w-full max-w-2xl relative flex items-center justify-center">
        <div className="absolute left-4 text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Volcano name, location or status"
          className="w-full pl-12 pr-4 py-6 rounded-full bg-white/90 backdrop-blur-sm text-lg"
        />
      </div>

      <div className="absolute top-4 right-4 flex gap-4">
        <Button onClick={() => router.push('/')} variant="secondary" className="bg-white/90 backdrop-blur-sm">
          Home
        </Button>
        <Button onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }} variant="secondary" className="bg-white/90 backdrop-blur-sm">
          Back to Login Page
        </Button>
      </div>

      <div className="mt-8 w-full max-w-6xl px-4">
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((volcano, index) => (
              <Card key={index} className="p-4 bg-white/90 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">{volcano.Name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Location: {volcano.Location}, {volcano.Country}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Type: {volcano.Type}
                </p>
                {volcano.VEI !== null && (
                  <p className="text-sm text-gray-600 mb-1">
                    VEI: {volcano.VEI}
                  </p>
                )}
                {volcano.Year !== null && (
                  <p className="text-sm text-gray-600">
                    Year: {volcano.Year}
                  </p>
                )}
                {volcano["Elevation (m)"] !== null && (
                  <p className="text-sm text-gray-600">
                    Elevation: {volcano["Elevation (m)"]}m
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : searchQuery && !loading ? (
          <div className="text-center text-white">No results found</div>
        ) : null}
      </div>

      <div className="flex items-center justify-center w-full gap-8 mt-8 mb-8">
        <Button
          variant="secondary"
          size="lg"
          className="bg-white/90 backdrop-blur-sm px-8"
          onClick={() => router.push('/import-data')}
        >
          Import/Send Data
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white/90 backdrop-blur-sm px-8"
          onClick={() => router.push('/data-visualize')}
        >
          Data Visualization
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white/90 backdrop-blur-sm px-8"
          onClick={() => window.open('https://wjdavenport.github.io/CS416DVProject/scene2.html', '_blank')}
        >
          Map Visualization
        </Button>
      </div>
    </div>
  )
}