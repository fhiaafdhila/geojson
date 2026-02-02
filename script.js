// =======================
// INIT MAP
// =======================
const viewPidie = { center:[5.32,95.95], zoom:10.5 };
const map = L.map('map').setView(viewPidie.center, viewPidie.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; OpenStreetMap'
}).addTo(map);


/// ======================
/// GLOBAL STATE
/// ======================
let geoData, geoLayer, legend;
let datasetAktif = "total";
let dataPenduduk = {};
let layerLokasi = null;

let layerMasjid = L.layerGroup().addTo(map);

// =======================
// DATA LOKASI MASJID PIDIE
// =======================
const dataMasjid = [
  { nama:"Masjid Besar Syuhada Batee", kec:"Batee", koor:[5.409594424208203, 95.8952771706438], link:"https://maps.app.goo.gl/Vdc12pE2bREF3RaB6" },
  { nama:"Masjid Jamik Tgk Direubee", kec:"Delima", koor:[5.345650904921392, 95.89629855107295], link:"https://maps.app.goo.gl/99hEEPmXSXU1bE6d7" },
  { nama:"Rumoh Geudong Aceh", kec:"Geulumpang Tiga", koor:[5.244761639182323, 96.03083565224675], link:"https://maps.app.goo.gl/6Wtkw8Un31RAaZ1X8" },
  { nama:"Masjid Taqwa", kec:"Indra Jaya", koor:[5.308254925206823, 95.93255316203563], link:"https://maps.app.goo.gl/GcyaESzKhJd4ohYE7" },
  { nama:"Masjid Kembang Tanjong", kec:"Kembang Tanjong", koor:[5.30366427776032, 96.01445037923106], link:"https://maps.app.goo.gl/Vnjd7wHpHgr2qxTK6" },
  { nama:"Masjid Istiqomah Blang Paseh", kec:"Kota Sigli", koor:[5.3786403423701845, 95.96882971111842], link:"https://maps.app.goo.gl/vsAwYgCy4LN9BnEUA" },
  { nama:"Masjid Muara Tiga", kec:"Muara Tiga", koor:[5.514268862948332, 95.8469916701237], link:"https://maps.app.goo.gl/yp4sTf1dqLBpq8H99" },
  { nama:"Masjid Abu Daud Beureueh", kec:"Mutiara", koor:[5.281619028582339, 95.97822815176818], link:"https://maps.app.goo.gl/KuBbABNCxVhRSxdy6" },
  { nama:"Masjid Padang Tiji", kec:"Padang Tiji", koor:[5.37392232671885, 95.84770419272323], link:"https://maps.app.goo.gl/crMfwKA84TGpfLpRA" },
  { nama:"Masjid Darul Huda", kec:"Peukan Baro", koor:[5.341165561194573, 95.96765694669185], link:"https://maps.app.goo.gl/9csVxx5Zh51hWfxy9" },
  { nama:"Masjid Istiqamah", kec:"Sakti", koor:[5.2528276351180425, 95.94355195715222], link:"https://maps.app.goo.gl/TXjGQ5RpLJSuwN3o9" },
  { nama:"Masjid At-Taqwa", kec:"Simpang Tiga", koor:[5.347319353676429, 95.99116715159303], link:"https://maps.app.goo.gl/tUJaMSEZ7EyPBN518" },
  { nama:"Masjid Alue Calong", kec:"Tangse", koor:[5.150097540764904, 95.8766543227569], link:"https://maps.app.goo.gl/bjQ6YSuA5oYs6TNr6" },
  { nama:"Masjid Babussalam", kec:"Tiro/Truseb", koor:[5.217980250016339, 95.95278921917682], link:"https://maps.app.goo.gl/6hc9nghx5p3UrGccA" },
  { nama:"Masjid Raya Keumala", kec:"Keumala", koor:[5.23502756127724, 95.89012739154758], link:"https://maps.app.goo.gl/3sQm8cZ6YSjEFYq39" },
  { nama:"Masjid Baitul Huda", kec:"Mutiara Timur", koor:[5.2583674389694925, 95.99251124366067], link:"https://maps.app.goo.gl/udf7W2y9Pc3xoYSSA" },
  { nama:"Masjid Grong-Grong", kec:"Grong Grong", koor:[5.37987856574868, 95.90823634736682], link:"https://maps.app.goo.gl/oafuYqbFbzpT1ptv8" },
  { nama:"Masjid Syuhada", kec:"Geumpang", koor:[4.8455541775140025, 96.1290946621591], link:"https://maps.app.goo.gl/y7Cnns6erT7BJ3x59" }, 
  { nama:"Masjid Nurul Iman", kec:"Mane", koor:[4.855133106823581, 96.10205833016916], link:"https://maps.app.goo.gl/EJYV1fSH5DuJEAc18" }
];


function tampilkanMasjid(){
  layerMasjid.clearLayers();

  dataMasjid.forEach(m => {
    const marker = L.marker(m.koor, { icon: iconMesjid })
      .addTo(layerMasjid);

    marker.bindPopup(`
      <b>${m.nama}</b><br>
      Kecamatan: ${m.kec}<br>
      <a href="${m.link}" target="_blank">
        📍 Buka di Google Maps
      </a>
    `);
  });
}

// =======================
// UTIL
// =======================
const ribuan = n => n.toLocaleString("id-ID");
const norm = n => n.toUpperCase().trim();

// =======================
// SKALA WARNA PER DATASET
// =======================
function getColor(d){
  if(datasetAktif==="laki"){
    return d > 20000 ? '#03132b' :
           d > 17000 ? '#023161' :
           d > 12000 ? '#085599' :
           d > 10000 ? '#0088ff' :
           d > 5000  ? '#58b1ff' :
           d > 2000  ? '#9bd3f8' :
                       '#ffffff';
  }

  if(datasetAktif==="perempuan"){
    return d > 60000 ? '#250613' :
           d > 40000 ? '#5c0c2d' :
           d > 35000 ? '#910c43' :
           d > 30000 ? '#ac0c4e' :
           d > 20000 ? '#df0660' :
           d > 15000 ? '#ff2781' :
           d > 12000 ? '#ff7587f1' :
           d > 5000  ? '#f768a1e0' :
                       '#ff93bc';
  }

  // TOTAL (MERAH)
  return d > 70000 ? '#3f3b00' :
         d > 60000 ? '#696305' :
         d > 45000 ? '#85861b' :
         d > 40000 ? '#b4a202' :
         d > 30000 ? '#ffee00' :
         d > 20000 ? '#e9e641' :
         d > 10000 ? '#ffe77c' :
         d > 5000  ? '#eefab7' :
                     '#ffffff';
}

// =======================
// STYLE
// =======================
function style(feature){
  const nama = norm(feature.properties.NAME_3);
  const d = dataPenduduk[nama];
  let nilai = 0;

  if(d){
    if(datasetAktif==="laki") nilai=d.laki;
    else if(datasetAktif==="perempuan") nilai=d.perempuan;
    else nilai=d.total;
  }

  return{
    fillColor:getColor(nilai),
    weight:1,
    color:'#444',
    fillOpacity:1
  };
}

// =======================
// POPUP SESUAI DATASET
// =======================
function onEachFeature(feature,layer){
  const nama = norm(feature.properties.NAME_3);
  const d = dataPenduduk[nama];
  if(!d) return;

  let isi="";
  if(datasetAktif==="laki"){
    isi=`Laki-laki: <b>${ribuan(d.laki)}</b> jiwa`;
  }else if(datasetAktif==="perempuan"){
    isi=`Perempuan: <b>${ribuan(d.perempuan)}</b> jiwa`;
  }else{
    isi=`Jumlah Penduduk: <b>${ribuan(d.total)}</b> jiwa`;
  }

  layer.bindPopup(`<b>${nama}</b><br>${isi}`);
}

// =======================
// RENDER MAP (ANTI BUG)
// =======================
function render(){
  if(geoLayer) map.removeLayer(geoLayer);
  geoLayer = L.geoJSON(geoData,{
    style,
    onEachFeature
  }).addTo(map);
  buatLegend();
}

// =======================
// LEGEND DINAMIS
// =======================
function buatLegend(){
  if(legend) legend.remove();

  let grades=[];
  if(datasetAktif==="laki") grades=[0,2000,5000,10000,12000,17000,20000];
  else if(datasetAktif==="perempuan") grades=[0,5000,12000,15000,20000,30000,35000,40000,60000];
  else grades=[0,5000,10000,20000,30000,40000,45000,60000,70000];

  legend = L.control({position:'bottomright'});
  legend.onAdd = function(){
    const div = L.DomUtil.create('div','legend');
    div.innerHTML=`<h4>${datasetAktif.toUpperCase()}</h4>`;

    for(let i=grades.length-1;i>=0;i--){
      div.innerHTML+=`
        <div>
          <span style="background:${getColor(grades[i]+1)}"></span>
          ${ribuan(grades[i])}${i===grades.length-1 ? '+' : ''}
        </div>`;
    }
    return div;
  };
  legend.addTo(map);
}


// =======================
// LOAD GEOJSON
// =======================
fetch("data/pidie.geojson")
.then(r=>r.json())
.then(g=>geoData=g);

// =======================
// LOAD API (KHUSUS 2023)
// =======================
fetch("https://data.pidiekab.go.id/api/3/action/datastore_search?resource_id=904f8479-7acb-4a5f-9ef8-1d4bdeee52df&limit=1000")
.then(r=>r.json())
.then(json=>{
  json.result.records.forEach(r=>{
    if(r.tahun =="2023") return;   // 🔥 FILTER TAHUN

    const nama = norm(r.kemendagri_nama_kecamatan);
    if(!dataPenduduk[nama])
      dataPenduduk[nama]={laki:0,perempuan:0,total:0};

    if(r.jenis_kelamin==="Laki-laki")
      dataPenduduk[nama].laki+=r.jumlah_penduduk;
    else
      dataPenduduk[nama].perempuan+=r.jumlah_penduduk;

    dataPenduduk[nama].total =
      dataPenduduk[nama].laki + dataPenduduk[nama].perempuan;
  });
  render();
});

// =======================
// DATASET LOKASI MESJID
// =======================

// status: tampil / tidak
let lokasiAktif = false;

// icon mesjid
var iconMesjid = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [26, 26]
});



// =======================
// FUNGSI TOMBOL
// =======================
function toggleLokasi() {
  if (!lokasiAktif) {
    layerMasjid.addTo(map);
    lokasiAktif = true;
  } else {
    map.removeLayer(layerMasjid);
    lokasiAktif = false;
  }
}


// =======================
// GANTI DATASET
// =======================
function gantiDataset(j){
  datasetAktif=j;
  map.setView(viewPidie.center,viewPidie.zoom);
  render();
}

tampilkanMasjid();

