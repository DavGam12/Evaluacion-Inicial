let map // mapX = y; mapY = x

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded")


    map = L.map('map').setView([42, 1], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('Fuck you ordinary old bitch!')
        .openPopup();


    const imageUrl = "/Images/Logo.png",
    imageBounds = [[42.009, 1], [42, -3]];
    L.imageOverlay(imageUrl, imageBounds).addTo(map);

    const circle = L.circle([42, 1], {
    color: 'maroon',
        fillColor: '#ff3',
        fillOpacity: 0.5,
        radius: 1000
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

    console.log('categoriesData -->', categoriesData)
    console.log('eventsData -->', eventsData)

    categoriesFetch(categoriesData)
    eventsFetch(eventsData)
}

const categoriesFetch = async(data) => {
    Array.from(data.categories).forEach(e => {
        const categoriesUl = document.getElementsByClassName("categories")[0]
        const categoryLi = categoriesUl.appendChild(document.createElement("li"))
        categoryLi.textContent = e.title
    })
}

const eventsFetch = async(data) => {
    Array.from(data.events).forEach(e => {
        console.log(e);
        console.log(e.geometry[0].coordinates);

        const icons =
        [
            L.icon({
                iconUrl: '/Images/drought.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/dustHaze.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/earthquakes.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/floods.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/landslides.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/manmade.png', /* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/seaLakeIce.png',
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/severeStorms.png',
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/snow.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/tempExtremes.png',/* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/volcanoes.png',
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/waterColor.png', /* */
                iconSize: [30, 30]
            }),
            L.icon({
                iconUrl: '/Images/wildfires.png',
                iconSize: [30, 30]
            })
        ]
        icons.forEach(i => {
            const iconUrlId = i.options.iconUrl.split('/')[2].split('.')
            if (iconUrlId[0].includes(e.categories[0].id))
            {
                console.log('sus')
                L.marker([e.geometry[0].coordinates[1], e.geometry[0].coordinates[0]], {icon: i}).addTo(map)
                .bindPopup(`[${e.geometry[0].coordinates[1]},${e.geometry[0].coordinates[0]}]`)
                .addEventListener("click", () => {})
            }
        })

    })
}
