document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded")


    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();


    const imageUrl = "Images/Logo.png",
    imageBounds = [[40, -1], [41, -4]];
    L.imageOverlay(imageUrl, imageBounds).addTo(map);

    const circle = L.circle([51.508, -0.11], {
    color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    
    fetchData()
})


/* FETCH */

const categoriesURL = "https://eonet.gsfc.nasa.gov/api/v3/categories"
const eventURL = "https://eonet.gsfc.nasa.gov/api/v3/events"

const fetchData = async() => {
    const [ categoriesRes, eventsRes ] = await Promise.all([fetch(categoriesURL), fetch(eventURL)])

    const categoriesData = await categoriesRes.json()
    const eventsData = await eventsRes.json()

    console.log(categoriesData)
    console.log(eventsData)

    categoriesFetch(categoriesData)
    //eventsFetch(eventsData)
}

const categoriesFetch = async(data) => {
    Array.from(data.categories).forEach(e => {
        const categoriesUl = document.getElementsByClassName("categories")[0]
        const categoryLi = categoriesUl.appendChild(document.createElement("li"))
        categoryLi.textContent = e.title
    })
}

const eventsFetch = async(data) => {
    
}

//const naturalDisastersFetch = async() => {}
