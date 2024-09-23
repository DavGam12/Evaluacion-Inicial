let map // mapX = y; mapY = x
let categoriesIconsData
const categories =
{
    "drought": false,
    "dustHaze": false,
    "earthquakes": false,
    "floods": false,
    "landslides": false,
    "manmade": false,
    "seaLakeIce": false,
    "severeStorms": false,
    "snow": false,
    "tempExtremes": false,
    "volcanoes": false,
    "waterColor": false,
    "wildfires": false
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded")
    const deployment = document.getElementsByClassName('categories')[0]


    map = L.map('map').setView([41.669841685814625, -0.8788074741911481], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([41.669841685814625, -0.8788074741911481]).addTo(map).bindPopup('San Valero Is Here')

    deployment.children[0].addEventListener("click", () => {
        Array.from(deployment.children).forEach(child => {
            if (child.tagName.toLowerCase().includes('li'))
            {
                if (child.style.display != 'block') {child.style.display = 'block'}
                else {child.style.display = 'none'}
            }
        })
    })

    fetchData()
})

const HideShowIcons = (cat, img, catTitle) => {
    if (categories[cat.id])
        {
            img.style.display = 'block'
            catTitle.style.color = categoriesIconsData[cat.id].color
            catTitle.style.fontWeight = 'bold'
        }
    else
        {
            img.style.display = 'none'
            catTitle.style.color = 'rgb(0,0,0)'
            catTitle.style.fontWeight = 'normal'
        }
}
const HideShowIconsAll = (cat, img) => {
    Array.from(categories).forEach(e => {
        
    })
}

/* FETCH */

const categoriesURL = "https://eonet.gsfc.nasa.gov/api/v3/categories"
const eventURL = "https://eonet.gsfc.nasa.gov/api/v3/events"
const categoriesIconsURL = `${window.location.origin}/icons.json`

const fetchData = async() => {
    const [ categoriesRes, eventsRes, categoriesIconsRes ] = await Promise.all([fetch(categoriesURL), fetch(eventURL), fetch(categoriesIconsURL)])

    const categoriesData = await categoriesRes.json()
    const eventsData = await eventsRes.json()
    categoriesIconsData = await categoriesIconsRes.json()

    console.log('categoriesData -->', categoriesData);
    console.log('eventsData -->', eventsData);
    console.log('categoriesIconsData -->', categoriesIconsData);

    categoriesFetch(categoriesData)
    eventsFetch(eventsData)
}

const categoriesFetch = async(data) => {
    Array.from(data.categories).forEach(e => {
        const categoriesUl = document.getElementsByClassName("categories")[0]
        const categoryLi = categoriesUl.appendChild(document.createElement("li"))
        categoryLi.textContent = e.title
        categoryLi.addEventListener("click", () => {
            categories[e.id] = !categories[e.id]
            Array.from(document.getElementsByTagName('img')).forEach(i => {
                if (i.alt.includes('mapIcon'))
                {
                    HideShowIcons(e, i, categoryLi)
                }
            })
        })
    })
}

const eventsFetch = async(data) => {
    Array.from(data.events).forEach(e => {
        console.log(e);

        const iconSize = [15, 15]
        const icons =
        [
            L.icon({
                iconUrl: '/Images/drought.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/dustHaze.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/earthquakes.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/floods.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/landslides.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/manmade.png', /* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/seaLakeIce.png',
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/severeStorms.png',
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/snow.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/tempExtremes.png',/* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/volcanoes.png',
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/waterColor.png', /* */
                iconSize: iconSize
            }),
            L.icon({
                iconUrl: '/Images/wildfires.png',
                iconSize: iconSize
            })
        ]

        const mainBox = document.getElementsByClassName("event-info")[0].appendChild(document.createElement("ul"))
        mainBox.classList.add('general-box')
        mainBox.classList.add("hide")

        const category = mainBox.appendChild(document.createElement('li'))
        category.appendChild(document.createElement('h3')).textContent = 'Category'
        category.appendChild(document.createElement('p')).textContent = e.categories[0].title
        
        const title = mainBox.appendChild(document.createElement("li"))
        title.appendChild(document.createElement('h3')).textContent = 'Title'
        title.appendChild(document.createElement('p')).textContent = e.title

        const geometryDate = e.geometry[0].date.split("T")
        const date = mainBox.appendChild(document.createElement("li"))
        date.appendChild(document.createElement('h3')).textContent = 'Date'
        date.appendChild(document.createElement('p')).textContent = `${geometryDate[0]}  ${geometryDate[1].replace("Z", "")}`

        if (e.description != null)
            {
                const description = mainBox.appendChild(document.createElement("li"))
                description.appendChild(document.createElement('h3')).textContent = 'Description'
                description.appendChild(document.createElement('p')).textContent = e.description
            }

        const url = mainBox.appendChild(document.createElement("li"))
        url.appendChild(document.createElement('h3')).textContent = 'Source'
        const a = url.appendChild(document.createElement('p'))
        a.appendChild(document.createElement('a')).textContent = e.sources[0].url
        a.childNodes[0].href = e.sources[0].url


        icons.forEach(i => {

            const iconUrlId = i.options.iconUrl.split('/')[2].split('.')
            if (iconUrlId[0].includes(e.categories[0].id))
            {
                const iconMarker = L.marker([e.geometry[0].coordinates[1], e.geometry[0].coordinates[0]], {icon: i}).addTo(map)
                .bindPopup(`[${e.geometry[0].coordinates[1]},${e.geometry[0].coordinates[0]}]`)
                .addEventListener("click", () => {
                    Array.from(document.getElementsByClassName("show")).forEach(shown => {
                        shown.classList.remove("show")
                        shown.classList.add("hide")
                    })
                    mainBox.classList.remove("hide")
                    mainBox.classList.add("show")
                })
                iconMarker._icon.alt = 'mapIcon'
            }
        })
    })
}