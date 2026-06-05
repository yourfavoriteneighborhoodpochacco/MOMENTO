import MomentoMap from "@/components/map/MomentoMap"
import NavBar from "@/components/ui/NavBar"

export default function MapPage() {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden"
        }}>
            <MomentoMap />
            <NavBar />
        </div>
    )
}