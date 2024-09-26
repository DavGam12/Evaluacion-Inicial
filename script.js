let map // mapX = y; mapY = x
let categoriesIconsData
let currentLocData
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

let events = []


const date = new Date

const currentDay = date.getDate()
const currentMonth = date.getMonth()+1
const currentYear = date.getFullYear()


let submitFilterButton

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded")

    map = L.map('map').setView([41.669841685814625, -0.8788074741911481], 10);
    
    L.marker([41.669841685814625, -0.8788074741911481]).addTo(map).bindPopup('San Valero Is Here')

    map.on('click', async(ev) => {
        await fetchWeather(ev.latlng.toString().split('(')[1].split(')')[0])
        Array.from(document.getElementsByTagName('img')).filter((e) => e.alt === 'tempMarker').forEach(e => {e.remove();})

        let currentPosIcon
        if (currentLocData.error) {currentPosIcon = L.icon({iconUrl: './Images/close.png', iconSize: [40,40]})}
        else
        {
            if (currentLocData.current.is_day === 1) {currentPosIcon = L.icon({iconUrl: './Images/day.png', iconSize: [40,40]})}
            else {currentPosIcon = L.icon({iconUrl: './Images/night.png', iconSize: [40,40]})}
        }
        
        if (currentLocData.error)
            {
                await L.marker(ev.latlng, {icon: currentPosIcon, alt: 'tempMarker'}).addTo(map)
                .bindPopup(`This location isn't available`).openPopup()
            }
            else
            {
                await L.marker(ev.latlng, {icon: currentPosIcon, alt: 'tempMarker'}).addTo(map)
                .bindPopup(`${currentLocData.location.name} [${ev.latlng.toString().split('(')[1].split(')')[0]}]`).openPopup()

                const mainBox = document.getElementsByClassName("event-info")[0].appendChild(document.createElement("ul"))
                mainBox.classList.add('general-box')
                mainBox.classList.add("show")

                const closeDiv = mainBox.appendChild(document.createElement('div'))
                closeDiv.classList.add('close')
                const closeImg = closeDiv.appendChild(document.createElement('img'))
                closeImg.src = '/Images/close.png'
                closeDiv.addEventListener('click', () => {
                    closeDiv.parentElement.remove()
                })
        
                const city = mainBox.appendChild(document.createElement('li'))
                city.appendChild(document.createElement('h3')).textContent = 'City: '
                city.appendChild(document.createElement('p')).textContent = currentLocData.location.name

                const country = mainBox.appendChild(document.createElement('li'))
                country.appendChild(document.createElement('h3')).textContent = 'Country: '
                country.appendChild(document.createElement('p')).textContent = currentLocData.location.country

                const coor = mainBox.appendChild(document.createElement('li'))
                coor.appendChild(document.createElement('h3')).textContent = 'Coordinates: '
                coor.appendChild(document.createElement('p')).textContent = `[${ev.latlng.toString().split('(')[1].split(')')[0]}]`

                const localtime = mainBox.appendChild(document.createElement('li'))
                localtime.appendChild(document.createElement('h3')).textContent = 'Localtime: '
                localtime.appendChild(document.createElement('p')).textContent = currentLocData.location.localtime

                const temperature = mainBox.appendChild(document.createElement('li'))
                temperature.appendChild(document.createElement('h3')).textContent = 'Temperature: '
                temperature.appendChild(document.createElement('p')).textContent = `${currentLocData.current.temp_c}ºC`

                const feellikeTemperature = mainBox.appendChild(document.createElement('li'))
                feellikeTemperature.appendChild(document.createElement('h3')).textContent = 'Feel like temperature: '
                feellikeTemperature.appendChild(document.createElement('p')).textContent = `${currentLocData.current.feelslike_c}ºC`

                const wind = mainBox.appendChild(document.createElement('li'))
                wind.appendChild(document.createElement('h3')).textContent = 'Wind: '
                wind.appendChild(document.createElement('p')).textContent = `${currentLocData.current.wind_kph} km/h`
                
                const windDir = mainBox.appendChild(document.createElement('li'))
                windDir.appendChild(document.createElement('h3')).textContent = 'Wind direction: '
                windDir.appendChild(document.createElement('p')).textContent = `${currentLocData.current.wind_kph} km/h`

                const gust = mainBox.appendChild(document.createElement('li'))
                gust.appendChild(document.createElement('h3')).textContent = 'Gust: '
                gust.appendChild(document.createElement('p')).textContent = `${currentLocData.current.gust_kph} km/h`

                const humidity = mainBox.appendChild(document.createElement('li'))
                humidity.appendChild(document.createElement('h3')).textContent = 'Humidity: '
                humidity.appendChild(document.createElement('p')).textContent = `${currentLocData.current.humidity}%`
            }
        console.log(ev.latlng);
    })

    osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors'
    });

    esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    });

    baseLayers = {
    "Open StreetMap": osmLayer,
    "Open TopoMap": topoLayer,
    "Open ESRI Street Map": esriLayer
    };

    osmLayer.addTo(map);
    L.control.layers(baseLayers).addTo(map);


    submitFilterButton = document.getElementById('submitFilter')
    const searchDateStart = document.getElementById('search_date_start')
    const searchDateEnd = document.getElementById('search_date_end')
    const removeAllFilterButtom = document.getElementById('removeAllFilters')

    if (currentMonth>9)
        {
            if (currentDay>9) {searchDateEnd.max = `${currentYear}-${currentMonth}-${currentDay}`}
            else {searchDateEnd.max = `${currentYear}-${currentMonth}-0${currentDay}`}
        }
    else
    {
        if (currentDay>9) {searchDateEnd.max = `${currentYear}-0${currentMonth}-${currentDay}`}
        else {searchDateEnd.max = `${currentYear}-0${currentMonth}-0${currentDay}`}
    }

    submitFilterButton.addEventListener("click", () => {
        if (searchDateStart.value != '' && searchDateEnd.value != '')
        {
            let active = 13
            Object.entries(categories).forEach(e => {if (!e[1]) {active--}})
            Array.from(events).forEach(e => {
                const currentEventDate = e.event.geometry[0].date.split('T')[0]
                
                if ((currentEventDate >= searchDateStart.value && currentEventDate <= searchDateEnd.value) && (categories[e.event.categories[0].id] || active === 0))
                {
                    HideShowIcons(e.event.categories[0], e.img._icon)
                    e.img._icon.style.display = 'block'
                }
                else
                {
                    e.img._icon.style.display = 'none'
                }
            })
        }
    })

    removeAllFilterButtom.addEventListener("click", () => {
        Object.keys(categories).forEach(k => {categories[k] = false})
        console.log(categories);
        searchDateStart.value = ''
        searchDateEnd.value = ''
        Array.from(document.getElementsByClassName('categories')[0].getElementsByTagName('li')).forEach(e => {
            e.style.color = '#e6e6fd'
            e.style.fontWeight = 'normal'
        })
        Array.from(events).forEach(e => {e.img._icon.style.display = 'block'})
    })



    fetchData()
})

const HideShowIcons = (cat, img) => {
    if (img.src.includes(categoriesIconsData[cat.id].url) && categories[cat.id]) {img.style.display = 'block'}
    else
    {
        Object.entries(categories).forEach(e => {
            if (!e[1] && img.src.includes(e[0])) {img.style.display = 'none'}
        })
        let active = 13
        Object.entries(categories).forEach(e => {if (!e[1]) {active--}})
        if (active === 0) {img.style.display = 'block'}
    }
}


/* FETCH */

const categoriesURL = "https://eonet.gsfc.nasa.gov/api/v3/categories"
const eventURL = "https://eonet.gsfc.nasa.gov/api/v3/events"
const categoriesIconsURL = `${window.location.origin}/icons.json`

const fetchWeather = async(coor) => {
    const weatherURL = `https://api.weatherapi.com/v1/current.json?key=3212cc342f1b43fe9ab184207242509%20&q=${coor}`
    const weatherRes = await fetch(weatherURL)
    currentLocData = await weatherRes.json()
}

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

    const categoriesUl = document.getElementsByClassName('desplegable')[0]

    Array.from(data.categories).forEach(e => {
        const categoryLi = categoriesUl.appendChild(document.createElement('li'))
        const categoryImgDiv = categoryLi.appendChild(document.createElement('div'))
        categoryImgDiv.classList.add('categoryImg')
        const categoryImg = categoryImgDiv.appendChild(document.createElement('img'))
        categoryImg.src = categoriesIconsData[e.id].url
        const categoryLiSpan = categoryLi.appendChild(document.createElement('span'))
        categoryLiSpan.textContent = e.title
        categoryLi.addEventListener("click", () => {
            categories[e.id] = !categories[e.id]
            if (categories[e.id])
                {
                    categoryLi.style.color = categoriesIconsData[e.id].color
                    categoryLi.style.fontWeight = 'bold'
                }
                else
                {
                    categoryLi.style.color = '#e6e6fd'
                    categoryLi.style.fontWeight = 'normal'
                }
            Array.from(document.getElementsByTagName('img')).filter((i) => i.alt.includes('mapIcon')).forEach(i => {HideShowIcons(e, i)})
            submitFilterButton.click()
        })
    })

    categoriesUl.parentElement.children[0].addEventListener("click", () => {
        Array.from(categoriesUl.children).forEach(child => {
            if (child.tagName.toLowerCase().includes('li'))
            {
                if (child.style.display != 'flex') {child.style.display = 'flex'}
                else {child.style.display = 'none'}
            }
        })
    })
}

const eventsFetch = async(data) => {
    Array.from(data.events).forEach((e, index) => {
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

        const closeDiv = mainBox.appendChild(document.createElement('div'))
        closeDiv.classList.add('close')
        const closeImg = closeDiv.appendChild(document.createElement('img'))
        closeImg.src = '/Images/close.png'
        closeDiv.addEventListener('click', () => {
            closeDiv.parentElement.classList.remove("show")
            closeDiv.parentElement.classList.add("hide")
        })

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
        a.target = 'blank'
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
                events[index] =
                {
                    "event": e,
                    "img": iconMarker
                }
            }
        })
    })
}
