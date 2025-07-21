import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapSection = () => {
    const position = [23.8504054, 90.3771042]; // Example: Dhaka, Bangladesh

    return (
        <section className="bg-base-200">
            <div className="container mx-auto py-12 px-4 md:px-10">
                <h2 className="text-3xl text-center font-bold text-[#00BBA7] mb-4">
                    Our Service Area
                </h2>
                <p className="text-center  max-w-2xl mx-auto mb-8">
                    Explore our prime locations. We help you find your dream home or property in your preferred neighborhood.
                </p>

                <div className="w-full h-[400px] rounded-lg shadow-lg relative z-0">
                    <MapContainer center={position} zoom={12} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                Our Main Office Location <br />Sector 17 <br /> Dhaka, Bangladesh.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
