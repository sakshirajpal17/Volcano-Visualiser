export interface VolcanoEvent {
    Year: number | null;
    Month: number | null;
    Day: number | null;
    Name: string;
    Location: string;
    Country: string;
    Latitude: number | null;
    Longitude: number | null;
    "Elevation (m)": number | null;
    Type: string;
    VEI: number | null;
    Agent: string | null;
    Deaths: number | null;
} 