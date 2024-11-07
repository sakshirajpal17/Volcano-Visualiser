'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast';


export default function ImportData() {
  const router = useRouter()
  
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Year: '',
    Month: '',
    Day: '',
    Location: '',
    Country: '',
    Latitude: '',
    Longitude: '',
    Elevation: '',
    Type: '',
    VEI: '',
    Agent: '',
    Deaths: ''
  })

  const volcanoTypes = [
    "Stratovolcano",
    "Shield Volcano",
    "Caldera",
    "Submarine",
    "Cinder Cone",
    "Complex Volcano",
    "Compound Volcano",
    "Crater",
    "Fissure vent",
    "Lava dome",
    "Maar",
    "Pyroclastic cone",
    "Pyroclastic shield",
    "Tuff cone",
    "Volcanic field"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert numeric fields
      const processedData = {
        ...formData,
        Year: formData.Year ? parseInt(formData.Year) : null,
        Month: formData.Month ? parseInt(formData.Month) : null,
        Day: formData.Day ? parseInt(formData.Day) : null,
        Latitude: formData.Latitude ? parseFloat(formData.Latitude) : null,
        Longitude: formData.Longitude ? parseFloat(formData.Longitude) : null,
        "Elevation (m)": formData.Elevation ? parseInt(formData.Elevation) : null,
        VEI: formData.VEI ? parseInt(formData.VEI) : null,
        Deaths: formData.Deaths ? parseInt(formData.Deaths) : null
      }

      const response = await fetch('/api/import-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      })

      if (!response.ok) {
        throw new Error('Failed to import data')
      }

      toast.success("Volcano event data has been imported successfully.")

      // Reset form
      setFormData({
        Name: '',
        Year: '',
        Month: '',
        Day: '',
        Location: '',
        Country: '',
        Latitude: '',
        Longitude: '',
        Elevation: '',
        Type: '',
        VEI: '',
        Agent: '',
        Deaths: ''
      })

    } catch (error) {
        toast.error("Failed to import volcano event data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
        const response = await fetch('/api/export-data');
        if (!response.ok) throw new Error('Export failed');
        
        // Get the blob from the response
        const blob = await response.blob();
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'volcano-events.csv';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
        
        toast.success("Data exported successfully");
    } catch (error) {
        console.error('Export failed:', error);
        toast.error("Failed to export data");
    }
  };

  return (
    <>  
      <Toaster position="top-center" />
      <div 
        className="min-h-screen w-full relative flex flex-col items-center px-4"
        style={{
            backgroundImage: "url('https://images6.alphacoders.com/435/435617.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}
        >
      <div className="absolute top-4 right-4 flex gap-4">
        <Button 
          onClick={() => router.push('/search')} 
          variant="secondary" 
          className="bg-white/90 backdrop-blur-sm"
          >
          Back to Search
        </Button>
        <Button 
          onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }} 
            variant="secondary" 
            className="bg-white/90 backdrop-blur-sm"
            >
          Logout
        </Button>
      </div>

      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Import Volcano Event Data
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Add a new volcanic event to the database
        </p>
      </div>

      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Volcano Name *</label>
              <Input
                required
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                placeholder="Enter volcano name"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <Select 
                required
                value={formData.Type}
                onValueChange={(value: string) => handleInputChange('Type', value)}
                >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {volcanoTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Input
                type="number"
                value={formData.Year}
                onChange={(e) => handleInputChange('Year', e.target.value)}
                placeholder="YYYY"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Input
                type="number"
                min="1"
                max="12"
                value={formData.Month}
                onChange={(e) => handleInputChange('Month', e.target.value)}
                placeholder="1-12"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Day</label>
              <Input
                type="number"
                min="1"
                max="31"
                value={formData.Day}
                onChange={(e) => handleInputChange('Day', e.target.value)}
                placeholder="1-31"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">VEI</label>
              <Input
                type="number"
                min="0"
                max="8"
                value={formData.VEI}
                onChange={(e) => handleInputChange('VEI', e.target.value)}
                placeholder="0-8"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location *</label>
              <Input
                required
                value={formData.Location}
                onChange={(e) => handleInputChange('Location', e.target.value)}
                placeholder="Enter location"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country *</label>
              <Input
                required
                value={formData.Country}
                onChange={(e) => handleInputChange('Country', e.target.value)}
                placeholder="Enter country"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                step="0.000001"
                value={formData.Latitude}
                onChange={(e) => handleInputChange('Latitude', e.target.value)}
                placeholder="-90 to 90"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                step="0.000001"
                value={formData.Longitude}
                onChange={(e) => handleInputChange('Longitude', e.target.value)}
                placeholder="-180 to 180"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Elevation (m)</label>
              <Input
                type="number"
                value={formData.Elevation}
                onChange={(e) => handleInputChange('Elevation', e.target.value)}
                placeholder="Enter elevation"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deaths</label>
              <Input
                type="number"
                min="0"
                value={formData.Deaths}
                onChange={(e) => handleInputChange('Deaths', e.target.value)}
                placeholder="Enter number of deaths"
                />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Agent</label>
              <Input
                value={formData.Agent}
                onChange={(e) => handleInputChange('Agent', e.target.value)}
                placeholder="E.g., P,T (Pyroclastic, Tsunami)"
                />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/search')}
              >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              >
              {loading ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-6 mb-8 mt-4">
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Export Data</h2>
            <p className="text-gray-600 mb-4">
                Download the complete volcano events dataset in CSV format
            </p>
            <Button
                onClick={handleExport}
                variant="outline"
                className="w-full sm:w-auto"
            >
                Export to CSV
            </Button>
        </div>
      </Card>
    </div>
                </>
  )
} 