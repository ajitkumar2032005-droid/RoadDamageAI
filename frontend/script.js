// ==========================================
// AI ROAD SURFACE QUALITY - MAIN SCRIPT
// ==========================================


let selectedFile = null;

let currentLatitude = null;
let currentLongitude = null;


// ==========================================
// FILE SELECTION
// ==========================================


const fileInput =
    document.getElementById("roadFile");


const previewImage =
    document.getElementById("previewImage");


const previewPlaceholder =
    document.getElementById("previewPlaceholder");


fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    selectedFile = file;


    // Check image

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";

        return;
    }


    // Preview

    const imageURL =
        URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewImage.style.display = "block";

    previewPlaceholder.style.display = "none";

});



// ==========================================
// AI ROAD SURFACE ANALYSIS
// ==========================================


async function inspectRoad() {


    const loading =
        document.getElementById("loading");


    const resultPlaceholder =
        document.getElementById(
            "resultPlaceholder"
        );


    const resultContent =
        document.getElementById(
            "resultContent"
        );


    const status =
        document.getElementById(
            "inspectionStatus"
        );


    if (!selectedFile) {

        alert(
            "Please select a road image first."
        );

        return;
    }


    // Show loading

    loading.classList.remove("hidden");

    resultPlaceholder.classList.add("hidden");

    resultContent.classList.add("hidden");


    try {


        // ======================================
        // SEND IMAGE TO BACKEND
        // ======================================


        const formData =
            new FormData();


        formData.append(
            "file",
            selectedFile
        );


        const response =
            await fetch(
                "/api/inspect",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        loading.classList.add("hidden");


        // ======================================
        // CHECK RESPONSE
        // ======================================


        if (!data.success) {

            alert(
                data.message ||
                "AI analysis failed."
            );


            resultPlaceholder.classList.remove(
                "hidden"
            );


            return;
        }



        // ======================================
        // AI RESULTS
        // ======================================


        const roadCondition =
            data.road_condition ||
            "UNKNOWN";


        const confidence =
            Number(
                data.confidence || 0
            );


        const severity =
            data.severity ||
            "UNKNOWN";


        const estimatedCost =
            Number(
                data.estimated_cost || 0
            );



        // ======================================
        // UPDATE MAIN RESULTS
        // ======================================


        document.getElementById(
            "damageCount"
        ).textContent =
            confidence.toFixed(2) + "%";


        document.getElementById(
            "severity"
        ).textContent =
            severity;


        document.getElementById(
            "roadCondition"
        ).textContent =
            roadCondition;


        document.getElementById(
            "estimatedCost"
        ).textContent =
            "₹" +
            estimatedCost.toLocaleString(
                "en-IN"
            );



        // ======================================
        // UPDATE DETAILS
        // ======================================


        document.getElementById(
            "potholeDetail"
        ).textContent =
            confidence.toFixed(2) + "%";


        document.getElementById(
            "severityDetail"
        ).textContent =
            severity;


        document.getElementById(
            "conditionDetail"
        ).textContent =
            roadCondition;



        // ======================================
        // RECOMMENDATIONS
        // ======================================


        const recommendations =
            document.getElementById(
                "recommendations"
            );


        let recommendationText;



        if (
            roadCondition === "GOOD"
        ) {


            recommendationText = `

                <li>
                    Road surface quality appears good.
                </li>

                <li>
                    Continue regular road monitoring.
                </li>

                <li>
                    Schedule periodic preventive inspection.
                </li>

            `;


        }

        else if (
            roadCondition === "MODERATE"
        ) {


            recommendationText = `

                <li>
                    Plan routine surface maintenance.
                </li>

                <li>
                    Monitor cracks and surface deterioration.
                </li>

                <li>
                    Schedule a follow-up inspection.
                </li>

            `;


        }

        else {


            recommendationText = `

                <li>
                    Priority road maintenance is recommended.
                </li>

                <li>
                    Inspect damaged surface areas promptly.
                </li>

                <li>
                    Consider detailed engineering assessment.
                </li>

            `;

        }


        recommendations.innerHTML =
            recommendationText;



        // ======================================
        // STATUS
        // ======================================


        status.textContent =
            "✓ Analysis Completed";


        status.classList.add(
            "success"
        );


        resultContent.classList.remove(
            "hidden"
        );



        // ======================================
        // CONSOLE OUTPUT
        // ======================================


        console.log(
            "Road Condition:",
            roadCondition
        );


        console.log(
            "Confidence:",
            confidence + "%"
        );


        console.log(
            "Severity:",
            severity
        );


        console.log(
            "Estimated Cost:",
            estimatedCost
        );



        // ======================================
        // SCROLL TO RESULTS
        // ======================================


        document
            .getElementById("results")
            .scrollIntoView({
                behavior: "smooth"
            });


    }

    catch (error) {


        loading.classList.add(
            "hidden"
        );


        console.error(
            error
        );


        alert(
            "Backend connection failed. Make sure Flask server is running."
        );

    }

}



// ==========================================
// GET CURRENT LOCATION
// ==========================================


function getLocation() {


    const status =
        document.getElementById(
            "locationStatus"
        );


    const coordinates =
        document.getElementById(
            "coordinates"
        );



    if (!navigator.geolocation) {

        status.innerHTML =
            "❌ Geolocation is not supported.";

        return;
    }



    status.innerHTML =
        "📍 Getting current location...";



    navigator.geolocation.getCurrentPosition(

        function (position) {


            currentLatitude =
                position.coords.latitude;


            currentLongitude =
                position.coords.longitude;



            status.innerHTML = `

                <span class="location-dot"></span>

                Location Captured

            `;



            coordinates.innerHTML = `

                Latitude:
                ${currentLatitude.toFixed(6)}

                <br>

                Longitude:
                ${currentLongitude.toFixed(6)}

            `;

        },


        function (error) {


            console.error(
                error
            );


            status.innerHTML =
                "❌ Unable to get location.";

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}



// ==========================================
// SEND REPORT
// ==========================================


function sendReport() {


    if (!selectedFile) {

        alert(
            "Please complete an AI surface analysis first."
        );

        return;
    }



    const confidence =
        document.getElementById(
            "damageCount"
        ).textContent;



    if (
        confidence === "0%" ||
        confidence === ""
    ) {

        alert(
            "Please run AI surface analysis first."
        );

        return;
    }



    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert(
            "Please capture your current location first."
        );

        return;
    }



    alert(
        "Report system is ready. Email integration will be connected to the Flask backend next."
    );

}



// ==========================================
// LOGOUT
// ==========================================


function logout() {

    window.location.href = "/";

}



// ==========================================
// LOCATION SEARCH + MAP
// ==========================================


let map = null;

let marker = null;



async function findLocation() {


    const input =
        document.getElementById(
            "locationInput"
        );


    const locationInfo =
        document.getElementById(
            "locationStatus"
        );


    const coordinates =
        document.getElementById(
            "coordinates"
        );


    const locationName =
        input.value.trim();



    if (!locationName) {

        alert(
            "Please enter a location name."
        );

        return;
    }



    locationInfo.innerHTML =
        "🔍 Finding location...";


    coordinates.innerHTML =
        "";



    try {


        // ======================================
        // OPENSTREETMAP GEOCODING
        // ======================================


        const response =
            await fetch(

                "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +

                encodeURIComponent(
                    locationName
                )

            );



        const data =
            await response.json();



        if (
            !data ||
            data.length === 0
        ) {

            locationInfo.innerHTML =
                "❌ Location not found.";

            return;
        }



        const place =
            data[0];


        const latitude =
            parseFloat(
                place.lat
            );


        const longitude =
            parseFloat(
                place.lon
            );



        currentLatitude =
            latitude;


        currentLongitude =
            longitude;



        locationInfo.innerHTML = `

            <span class="location-dot"></span>

            Location Found

        `;



        coordinates.innerHTML = `

            Latitude:
            ${latitude.toFixed(6)}

            <br>

            Longitude:
            ${longitude.toFixed(6)}

        `;



        // ======================================
        // CREATE MAP
        // ======================================


        if (!map) {


            map =
                L.map("map").setView(
                    [
                        latitude,
                        longitude
                    ],
                    15
                );


            L.tileLayer(

                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

                {

                    attribution:
                        "&copy; OpenStreetMap contributors"

                }

            ).addTo(map);


        }

        else {


            map.setView(
                [
                    latitude,
                    longitude
                ],
                15
            );

        }



        // ======================================
        // MARKER
        // ======================================


        if (marker) {

            map.removeLayer(
                marker
            );

        }



        marker =
            L.marker(
                [
                    latitude,
                    longitude
                ]
            )
            .addTo(map)
            .bindPopup(
                place.display_name
            )
            .openPopup();



    }

    catch (error) {


        console.error(
            error
        );


        locationInfo.innerHTML =
            "❌ Unable to find location.";

    }

}


// ==========================================
// AI SMART ROUTE FINDER
// ==========================================

async function getCoordinates(place) {
    const url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
        encodeURIComponent(place);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.length) {
        return null;
    }

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name
    };
}


// Get driving route
async function getDrivingRoute(from, to) {

    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${from.lon},${from.lat};${to.lon},${to.lat}` +
        `?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || !data.routes.length) {
        return null;
    }

    return data.routes[0];
}


// Main route function
async function findBestRoute() {

    const fromInput =
        document.getElementById("fromLocation");

    const toInput =
        document.getElementById("toLocation");

    const resultBox =
        document.getElementById("routeResult");

    const from = fromInput.value.trim();
    const to = toInput.value.trim();

    if (!from || !to) {
        resultBox.innerHTML = `
            <div class="route-error">
                ⚠️ Please enter both starting location and destination.
            </div>
        `;
        return;
    }

    resultBox.innerHTML = `
        <div class="route-loading">
            🔍 Searching for the best route...
        </div>
    `;

    try {

        const fromLocation = await getCoordinates(from);
        const toLocation = await getCoordinates(to);

        if (!fromLocation || !toLocation) {

            resultBox.innerHTML = `
                <div class="route-error">
                    ❌ Location not found. Please enter a valid location.
                </div>
            `;

            return;
        }

        const route =
            await getDrivingRoute(fromLocation, toLocation);

        if (!route) {

            resultBox.innerHTML = `
                <div class="route-error">
                    ❌ No driving route found.
                </div>
            `;

            return;
        }

        const distance =
            (route.distance / 1000).toFixed(1);

        const duration =
            Math.round(route.duration / 60);

        resultBox.innerHTML = `
            <div class="best-route-card">

                <div class="route-card-header">
                    <div>
                        <span class="route-badge">AI RECOMMENDED</span>
                        <h3>🟢 Best Available Route</h3>
                    </div>
                </div>

                <div class="route-details">

                    <div class="route-detail">
                        <span>📏</span>
                        <div>
                            <small>Distance</small>
                            <strong>${distance} km</strong>
                        </div>
                    </div>

                    <div class="route-detail">
                        <span>⏱️</span>
                        <div>
                            <small>Estimated Time</small>
                            <strong>${duration} min</strong>
                        </div>
                    </div>

                    <div class="route-detail">
                        <span>🤖</span>
                        <div>
                            <small>AI Road Quality</small>
                            <strong>Analysis Available</strong>
                        </div>
                    </div>

                </div>

                <div class="route-message">
                    🛣️ Route found successfully.
                    AI road-condition analysis can be applied
                    to this route.
                </div>

            </div>
        `;

        // Show route on map
        showRouteOnMap(route);

    } catch (error) {

        console.error("Route Error:", error);

        resultBox.innerHTML = `
            <div class="route-error">
                ❌ Unable to find route. Please try again.
            </div>
        `;
    }
}


// Swap From and To
function swapLocations() {

    const from =
        document.getElementById("fromLocation");

    const to =
        document.getElementById("toLocation");

    const temp = from.value;

    from.value = to.value;
    to.value = temp;
}


// Current location
function useCurrentLocation() {

    const fromInput =
        document.getElementById("fromLocation");

    if (!navigator.geolocation) {

        alert("Your browser does not support location.");

        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                const data = await response.json();

                fromInput.value =
                    data.display_name ||
                    `${lat}, ${lon}`;

            } catch {

                fromInput.value =
                    `${lat}, ${lon}`;
            }

        },
        function() {

            alert(
                "Location permission denied. Please enter your location manually."
            );

        }
    );
}


// Display route information
function showRouteOnMap(route) {

    const mapBox =
        document.getElementById("routeMap");

    if (!mapBox) return;

    const coordinates =
        route.geometry.coordinates;

    const first =
        coordinates[0];

    const last =
        coordinates[coordinates.length - 1];

    mapBox.innerHTML = `
        <div class="map-placeholder">

            <div style="font-size:50px;">🗺️</div>

            <h3>Route Found</h3>

            <p>
                Start: ${first[1].toFixed(4)},
                ${first[0].toFixed(4)}
            </p>

            <p>
                Destination: ${last[1].toFixed(4)},
                ${last[0].toFixed(4)}
            </p>

            <p>
                🟢 Driving route successfully calculated
            </p>

        </div>
    `;
}


// ==========================================
// END OF SCRIPT
// ==========================================