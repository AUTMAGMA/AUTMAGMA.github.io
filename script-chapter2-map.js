// Variabel Global (agar bisa diakses antar fungsi)
let map;
let infoWindow;
let carMarker;
let routePath;
let animationTimeout; // Untuk mengontrol jeda

// Data lokasi kenangan Anda (SUDAH DIPERBARUI)
const locations = [
    {
        title: "Cove Hillcrest", // Judul Pin
        story: "Pertama kali jemput kamu di sini... Awal dari semua cerita kita. ❤️", // Cerita Anda
        image: "Picture/COVE.JPG", // Path gambar Anda
        lat: -6.225914,
        lng: 106.602011
    },
    {
        title: "Supermall Karawaci",
        story: "Kencan pertama kita dimulai di sini! Masih inget nggak kita makan apa?",
        image: "Picture/SPM.JPG", // Path gambar Anda
        lat: -6.2260,
        lng: 106.6062
    },
    {
        title: "IKEA Alam Sutra",
        story: "Lanjut Kita ke Ikea beli ICE Cream terus jalan Date IKEA Sayang Heheheh..... .",
        image: "Picture/IKEA.jpeg", // Path gambar Anda
        lat: -6.219739, // Koordinat baru
        lng: 106.662633  // Koordinat baru
    },
    {
        title: "Living World Alam Sutra",
        story: "Abis itu kita ke LW Nonton, inget ga filmnya apa sayang??",
        image: "Picture/LW.jpg", // Path gambar Anda
        lat: -6.243883, // Koordinat baru
        lng: 106.652616  // Koordinat baru
    },
    {
        title: "U Residence 3",
        story: "Sebelum pulang kita ke ures 3 dulu, ngasih makan si BOBBY waktu itu sayang. ",
        image: "Picture/Ures3.JPG", // Path gambar Anda
        lat: -6.228048,
        lng: 106.608323
    }
];

document.addEventListener('DOMContentLoaded', function() {

    // ... (Kode variabel global map, infoWindow, dll. JANGAN HAPUS) ...
    // ... (Kode array locations JANGAN HAPUS) ...

    // === KODE BARU UNTUK MUSIK LATAR ===
    const mapMusic = document.getElementById('map-music');
    if (mapMusic) { // Pastikan elemen audio ada
        // Coba putar musik setelah halaman selesai transisi fade-in
        setTimeout(() => {
            mapMusic.play().catch(error => {
                console.warn("Autoplay musik latar peta diblokir:", error);
                // Opsi Fallback: Tampilkan tombol kecil untuk play manual
                // const playButton = document.createElement('button');
                // playButton.innerText = '🎵'; // Tombol ikon musik
                // playButton.id = 'play-map-music-button'; // Beri ID untuk styling
                // playButton.onclick = () => {
                //     mapMusic.play();
                //     playButton.style.display = 'none'; // Sembunyikan setelah diklik
                // };
                // document.body.appendChild(playButton); // Tambahkan ke body
            });
        }, 1500); // Tunggu 1.5 detik (sesuai durasi animasi fadeInPage di CSS)
    }
    // === AKHIR KODE MUSIK LATAR ===


    // Fungsi initMap() (JANGAN HAPUS isinya)
    function initMap() {
        // ... (Seluruh kode peta, marker, polyline Anda) ...
    }

    // ... (Kode style = document.createElement('style') JANGAN HAPUS) ...

}); // Akhir DOMContentLoaded

// Fungsi utama yang dipanggil Google Maps API
function initMap() {
    // 1. Tentukan titik tengah peta & level zoom awal (Sesuaikan jika perlu)
    const mapCenter = { lat: -6.235, lng: 106.63 }; // Titik tengah disesuaikan ke area Karawaci/Alsut
    const mapZoom = 14; // Zoom diatur agar semua pin muat

    map = new google.maps.Map(document.getElementById("google-map-container"), {
        center: mapCenter,
        zoom: mapZoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [ /* ... Kode style Snazzy Maps Anda ... */ ],
        // --- PASTE KEMBALI KODE STYLE SNAZZY MAPS ANDA DI SINI ---
        gestureHandling: 'none',     // Menonaktifkan geser/zoom dengan mouse/sentuhan
        zoomControl: false,          // Menyembunyikan tombol +/- zoom
        disableDoubleClickZoom: true,// Menonaktifkan zoom dengan double klik
        scrollwheel: false,          // Menonaktifkan zoom dengan scroll wheel
        draggable: false,             // Menonaktifkan geser peta (panning)
        styles: [
            { featureType: "water", stylers: [{ color: "#0000ff" }] } // Buat air jadi biru
        ]
    });

    infoWindow = new google.maps.InfoWindow();

    // 4. Buat Marker Kenangan (ikon hati)
    locations.forEach((location, index) => { // Tambahkan index
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title,
            icon: {
                url: 'assets/ikon-hati.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            // Simpan index lokasi di marker untuk referensi nanti
            customInfo: { index: index }
        });

        const contentString = `
            <div class="map-infowindow">
                <img src="${location.image}" alt="${location.title}">
                <h3>${location.title}</h3>
                <p>${location.story}</p>
            </div>
        `;

        marker.addListener('click', () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            // Hentikan animasi mobil jika pin diklik manual
            clearTimeout(animationTimeout);
            step = findNearestStep(marker.getPosition()); // Pindahkan mobil ke pin yang diklik
            carMarker.setPosition(marker.getPosition());
        });
    });

    // 5. Buat Garis Jejak (Polyline)
    const routeCoordinates = locations.map(location => ({ lat: location.lat, lng: location.lng }));
    routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#E14ECA',
        strokeOpacity: 0.9,
        strokeWeight: 5
    });
    routePath.setMap(map);

    // 6. Buat Marker Mobil (di titik awal)
    carMarker = new google.maps.Marker({
        position: routeCoordinates[0],
        map: map,
        icon: {
            url: 'Asset/mobil.png',
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
        },
        zIndex: 10
    });

    // Mulai animasi setelah peta sedikit stabil
    setTimeout(startAnimationSequence, 1500); // Ganti nama fungsi

} // Akhir dari initMap()


// === FUNGSI ANIMASI MOBIL ===
let step = 0;
const totalSteps = 2000;
const animationSpeed = 50;
const pauseDuration = 6000; // Jeda 6 detik

// Fungsi baru untuk memulai dan mengontrol urutan animasi
function startAnimationSequence(startStep = 0) {
    step = startStep;
    // Reset status visited untuk semua lokasi
    locations.forEach(loc => loc.visited = false);
    animateCar(); // Mulai animasi dari step yang ditentukan
}

function animateCar() {
    clearTimeout(animationTimeout);

    const path = routePath.getPath();
    if (!path || path.getLength() === 0) return; // Pengaman jika path belum siap

    const totalDistance = google.maps.geometry.spherical.computeLength(path);
    const distancePerStep = totalDistance / totalSteps;
    let currentDistance = step * distancePerStep;
    let currentPosition = path.getAt(0);

    let distanceTraveled = 0;
    for (let i = 0; i < path.getLength() - 1; i++) {
        let segmentStart = path.getAt(i);
        let segmentEnd = path.getAt(i + 1);
        let segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);

        if (distanceTraveled + segmentDistance >= currentDistance) {
            let fraction = (segmentDistance === 0) ? 0 : (currentDistance - distanceTraveled) / segmentDistance;
            currentPosition = google.maps.geometry.spherical.interpolate(segmentStart, segmentEnd, fraction);
            break;
        }
        distanceTraveled += segmentDistance;
    }

    if(currentPosition) carMarker.setPosition(currentPosition);

    let stoppedAtLocation = false;
    for (let i = 0; i < locations.length; i++) {
        let locationPos = new google.maps.LatLng(locations[i].lat, locations[i].lng);
        let carPos = carMarker.getPosition();
        if (!carPos) continue; // Pengaman jika posisi mobil belum ada

        let distanceToLocation = google.maps.geometry.spherical.computeDistanceBetween(carPos, locationPos);

        if (distanceToLocation < 50 && !locations[i].visited) {
            console.log("Berhenti di:", locations[i].title);
            stoppedAtLocation = true;
            locations[i].visited = true;

            // Langsung gunakan marker yang sudah ada
             // Cari marker hati yang cocok berdasarkan posisi (lebih akurat)
            let targetMarker = null;
            map.markers = map.markers || []; // Buat array untuk menyimpan marker hati
            if (map.markers.length !== locations.length) { // Isi array marker hati jika belum
                 map.markers = []; // Kosongkan dulu
                 locations.forEach(locData => {
                      map.markers.push(new google.maps.Marker({
                           position: { lat: locData.lat, lng: locData.lng },
                           map: map, // Tampilkan lagi (atau bisa dibuat invisible jika tidak mau duplikat)
                           icon: { url: 'Asset/ICON.png', scaledSize: new google.maps.Size(40, 40) }
                       }));
                 });
             }
            targetMarker = map.markers[i]; // Ambil marker berdasarkan index


            const contentString = `
                <div class="map-infowindow">
                    <img src="${locations[i].image}" alt="${locations[i].title}">
                    <h3>${locations[i].title}</h3>
                    <p>${locations[i].story}</p>
                </div>
            `;
            infoWindow.setContent(contentString);
            infoWindow.open(map, targetMarker ? targetMarker : carMarker); // Buka di marker hati

            animationTimeout = setTimeout(() => {
                infoWindow.close();
                // locations[i].visited = false; // Jangan reset agar tidak berhenti lagi
                animateCar(); // Lanjutkan animasi
            }, pauseDuration);
            break;
        }
    }

    if (!stoppedAtLocation) {
        step++;
        if (step <= totalSteps) {
            animationTimeout = setTimeout(animateCar, animationSpeed);
        } else {
            console.log("Animasi selesai!");
            document.body.classList.add('fade-out');
            setTimeout(() => { 
                window.location.href = 'navigation.html'; // Arahkan ke halaman navigasi
            }, 1000);
        }
    }
}

// Fungsi helper untuk mencari step terdekat dari posisi tertentu
function findNearestStep(targetPosition) {
    const path = routePath.getPath();
    const totalDistance = google.maps.geometry.spherical.computeLength(path);
    let minDistance = Infinity;
    let nearestStep = 0;

    for (let s = 0; s <= totalSteps; s++) {
        let currentDistance = s * (totalDistance / totalSteps);
        let currentPosition = path.getAt(0);
        let distanceTraveled = 0;
        for (let i = 0; i < path.getLength() - 1; i++) {
             let segmentStart = path.getAt(i);
             let segmentEnd = path.getAt(i + 1);
             let segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);
             if (distanceTraveled + segmentDistance >= currentDistance) {
                 let fraction = (segmentDistance === 0) ? 0 : (currentDistance - distanceTraveled) / segmentDistance;
                 currentPosition = google.maps.geometry.spherical.interpolate(segmentStart, segmentEnd, fraction);
                 break;
             }
             distanceTraveled += segmentDistance;
         }
         let distanceToTarget = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, targetPosition);
         if (distanceToTarget < minDistance) {
             minDistance = distanceToTarget;
             nearestStep = s;
         }
    }
    return nearestStep;
}


// Tambahkan gaya untuk Peta & InfoWindow (Versi Rapi)
const style = document.createElement('style');
style.textContent = `
    #google-map-container {
        height: 75vh;
        width: 150vh;
        margin: auto;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 2px solid rgba(255, 255, 255, 0.15);
        overflow: hidden;
    }
    .map-infowindow {
        max-width: 250px; padding: 5px; text-align: center;
        font-family: 'Poppins', sans-serif; color: #333;
    }
    .map-infowindow img {
        max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;
        display: block; margin-left: auto; margin-right: auto;
    }
    .map-infowindow h3 { margin: 0 0 8px 0; font-size: 1.3em; font-weight: 600; }
    .map-infowindow p { margin: 0; font-size: 0.9em; line-height: 1.4; color: #555; }
`;
document.head.appendChild(style);
