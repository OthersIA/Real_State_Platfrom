import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon
const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [60, 60],
});

const MapSection = () => {




    const position = [23.8504054, 90.3771042]; // Sector 17, Dhaka, Bangladesh

    return (
        <section
            className="bg-base-200"
            data-aos="fade-up"
            data-aos-duration="800"
        >
            <div className="container mx-auto py-12 px-4 md:px-10">
                <h2
                    className="text-3xl md:text-4xl text-center font-bold text-[#00BBA7] mb-4"
                    data-aos="fade-down"
                    data-aos-delay="100"
                >
                    Our Main Office Location
                </h2>
                <p
                    className="text-center max-w-2xl mx-auto mb-8"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    Visit our main office located beside Sector 17 in Dhaka. We’re always here to help you find your perfect property or assist with any of your real estate needs.
                </p>

                <div
                    className="w-full h-[600px] rounded-lg shadow-lg relative z-0"
                    data-aos="zoom-in"
                    data-aos-delay="300"
                >
                    <MapContainer
                        center={position}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={position} icon={markerIcon}>
                            <Popup>
                                📍 <strong>Our Main Office</strong>
                                <br />
                                Besides Sector 17,
                                <br />
                                Dhaka, Bangladesh
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
