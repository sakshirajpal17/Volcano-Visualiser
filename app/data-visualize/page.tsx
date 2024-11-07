'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'

interface VisualizationData {
  totalEvents: number
  averageVEI: number
  totalDeaths: number
  veiDistribution: Array<{ vei: number; count: number }>
  typeDistribution: Array<{ type: string; count: number }>
  eventsByTime: Array<{ century: number; count: number }>
  elevationDistribution: Array<{ range: string; count: number }>
  deadliestEvents: Array<{ Name: string; Year: number; Deaths: number; Location: string }>
  regionDistribution: Array<{ country: string; count: number }>
  monthlyDistribution: Array<{ month: string; count: number }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DataVisualization() {
  const router = useRouter()
  const [data, setData] = useState<VisualizationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/visualize')
        const visualizationData = await response.json()
        setData(visualizationData)
      } catch (error) {
        console.error('Failed to fetch visualization data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-2xl text-white">Loading visualization data...</div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col items-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('https://images6.alphacoders.com/435/435617.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Navigation buttons */}
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Button 
          onClick={() => router.push('/search')} 
          variant="secondary" 
          className="bg-white/90 backdrop-blur-sm text-sm sm:text-base"
        >
          Back to Search
        </Button>
        <Button 
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }} 
          variant="secondary" 
          className="bg-white/90 backdrop-blur-sm text-sm sm:text-base"
        >
          Logout
        </Button>
      </div>

      {/* Header */}
      <div className="mt-20 text-center px-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          Volcanic Data Visualization
        </h1>
        <p className="text-base sm:text-xl text-white/90 mb-8">
          Explore volcanic data through interactive charts and maps
        </p>
      </div>

      {/* KPI Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-2xl sm:text-3xl font-bold">{data?.totalEvents.toLocaleString()}</p>
        </Card>
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Average VEI</h3>
          <p className="text-2xl sm:text-3xl font-bold">{data?.averageVEI.toFixed(2)}</p>
        </Card>
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Total Deaths</h3>
          <p className="text-2xl sm:text-3xl font-bold">{data?.totalDeaths.toLocaleString()}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
        {/* VEI Distribution */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">VEI Distribution</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.veiDistribution} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="vei" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Volcano Types */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Volcano Types</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.typeDistribution}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data?.typeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Events by Century */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm col-span-1 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Events by Century</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data?.eventsByTime}
                margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
              >
                <XAxis 
                  dataKey="century" 
                  label={{ value: 'Century', position: 'bottom', offset: 15 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Number of Events', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 0
                  }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Elevation Distribution */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Elevation Distribution</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data?.elevationDistribution}
                margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
              >
                <XAxis 
                  dataKey="range" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Distribution */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Monthly Distribution</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data?.monthlyDistribution}
                margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Countries */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Countries by Events</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data?.regionDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="country" 
                  type="category"
                  width={90}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Deadliest Events Table */}
        <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm col-span-1 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Deadliest Volcanic Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Volcano</th>
                  <th className="text-left p-2">Year</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-right p-2">Deaths</th>
                </tr>
              </thead>
              <tbody>
                {data?.deadliestEvents.map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{event.Name}</td>
                    <td className="p-2">{event.Year}</td>
                    <td className="p-2">{event.Location}</td>
                    <td className="p-2 text-right">{event.Deaths.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}