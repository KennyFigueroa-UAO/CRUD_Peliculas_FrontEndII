// ======== Variables Globales ==========//

let USERS = {
    admin:"admin123",
    usuario:"1234",
    demo:"demo"
}

let currentUser = null
let globalMovies = []
let editingMovie = null

// ======== Inicializacion de APP ==========//

document.addEventListener("DOMContentLoaded",()=>{
    initAPP() // cargar aplicacion
    events() // cargar eventos
})

function initAPP(){
    // Cargar usuario registrados en localStorage
    loadRegisteredUsers()
    // Verificar si hay un usuario logueado
    let userLogged = localStorage.getItem('userLogged')
    if(userLogged){
        currentUser = JSON.parse(userLogged)                
        showDashboard(currentUser)
    }
    //Cargar peliculas de ejemplo
    if(!localStorage.getItem("movies")){
        loadExampleMovies()
    }
}

function loadRegisteredUsers(){
    // Obtener usuarios de localStorage y agregarlos a la variable USERS
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers"))
    if (registeredUsers){
        Object.assign(USERS, registeredUsers) // Agregar usuarios registrado a la variable USERS
    }
}
// ======== Eventos del usuario =========//
function events(){
    // Boton login
    document.getElementById("formLogin").addEventListener('submit',login)   
    document.getElementById("btnLogout").addEventListener('click',logout)   
    document.getElementById("formRegister").addEventListener('submit',register)
    document.getElementById("btnSaveMovie").addEventListener('click',saveMovie)
    document.getElementById("inputSearch").addEventListener('input',searchMovies)
    document.getElementById("selectGenre").addEventListener('change',searchMovies)
}

// Buscar peliculas con la opcion de busqueda
function searchMovies(e){
    let query = document.getElementById("inputSearch").value.trim().toLowerCase()
    let selectedGenre = document.getElementById("selectGenre").value
    let filteredMovies = globalMovies.filter((m)=> m.title.toLowerCase().includes(query) && (selectedGenre === "" || m.genre === selectedGenre))
    renderGrid(filteredMovies)
}

function login(e){
    e.preventDefault()
    let user = document.getElementById("inputUser").value
    let password = document.getElementById("inputPassword").value

    if(USERS[user] && USERS[user] === password){
        currentUser = user
        localStorage.setItem('userLogged',JSON.stringify(user))
        showDashboard(user)
        document.querySelector("#formLogin").reset()
    } else {
        alert("El usuario y la contraseña no son validos")
    }
}

function showDashboard(user){
    document.getElementById('loginSection').style.display = 'none'
    document.getElementById('btnLogin').style.display = 'none'
    document.getElementById('btnLogout').style.display = 'block'
    document.getElementById('mainContent').style.display = 'block'
    document.getElementById('btnAddMovie').style.display = 'block'
    document.querySelector('.userLogged').textContent = user;
    // Cargar peliculas
    loadMovies()    
}

function showLogin(){
    document.getElementById('loginSection').style.display = 'flex'
    document.getElementById('btnLogin').style.display = 'block'
    document.getElementById('btnLogout').style.display = 'none'
    document.getElementById('mainContent').style.display = 'none'
    document.getElementById('btnAddMovie').style.display = 'none'
    document.querySelector('.userLogged').textContent = null;
}

function logout(){
    let confirmLogout = confirm("Desea cerrar sesion?")
    if(confirmLogout){
        currentUser = null
        localStorage.removeItem('userLogged')
        showLogin()
        document.querySelector("#formLogin").reset()
    }
}

function register(e){
    e.preventDefault()
    let newName = document.getElementById("inputNewName").value.trim()
    let newEmail = document.getElementById("inputEmail").value.trim()
    let newUser = document.getElementById("inputUserReg").value.trim()
    let newPassword = document.getElementById("inputPasswordReg").value.trim()
    let confirmNewPassword = document.getElementById("inputConfirmPassword").value.trim()
    
    // Validar campos
    if(newName && newEmail && newUser && newPassword && confirmNewPassword){
        
        if(USERS[newUser]){
            alert("El usuario ya existe, por favor elige otro")
            return
        }

        USERS[newUser] = newPassword //Agregar nuevo usuario a la lista USERS
        // Guardar en localStorage
        let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {}
        registeredUsers[newUser] = newPassword
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
        alert(`Usuario ${newUser} registrado exitosamente ✅, ya puedes iniciar sesion`)

        //Limpiar el formulario de registro
        document.querySelector("#formRegister").reset()
        document.querySelector("#login-tab").click()
    } else {
        alert("Todos los campos son obligatorios")
    }

    if(newUser.length < 4){
        alert("EL nombre de usuario debe tener al menos 4 caracteres")
        return
    }

    if(newPassword.length < 6){
        alert("La contraseña debe tener al menos 6 caracteres")
        return
    }

    if(newPassword !== confirmNewPassword){
        alert("Las contraseñas no coinciden")
        return
    }
   
}
 
// ======== Cargar Pelicualas Ejemplo =========//

function loadExampleMovies(){
    
    let exampleMovies = [
            {
                id: 1,
                title:"Inception",
                genre:"Ciencia Ficción",
                director:"Christopher Nolan",
                year:2010,
                rate:8.8,
                description:"Un ladrón que roba secretos a través del uso de la tecnología de compartir sueños es dado la tarea inversa de plantar una idea en la mente de un CEO.",
                image:"https://play-lh.googleusercontent.com/buKf27Hxendp3tLNpNtP3E-amP0o4yYV-SGKyS2u-Y3GdGRTyfNCIT5WAVs2OudOz6so5K1jtYdAUKI9nw8"
            },
            {
                id: 2,
                title:"The Dark Knight",
                genre:"Acción",
                director:"Christopher Nolan",
                year:2008,
                rate:9.0,
                description:"Cuando el Joker, un criminal psicópata, desata el caos en Gotham, Batman debe aceptar una de las pruebas psicológicas y físicas más difíciles de su capacidad para luchar contra la injusticia.",
                image:"https://m.media-amazon.com/images/M/MV5BMDQ5MWU2YWUtNTQ4OC00Njk5LWI0NzctMjM4OGZiNmZmNGViXkEyXkFqcGc@._V1_.jpg"
            },
            {
                id:3,
                title:"Hercules",
                genre:"Animación",
                director:"Ron Clements, John Musker",
                year:1997,
                rate:7.3,
                description:"Hércules, el hijo de Zeus, es secuestrado al nacer por Hades, el dios del inframundo, quien teme que una profecía anuncie su caída a manos de su sobrino. Hércules es criado por humanos y, al descubrir su verdadera identidad, se embarca en una aventura para convertirse en un verdadero héroe y derrotar a Hades.",
                image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67wTSEafSaVxo4MAJc1TQ2sWza8dGbZuj9w&s"
            }
        ]
    
        // Guardar en localStorage
        localStorage.setItem("movies",JSON.stringify(exampleMovies))
}

// Cargar peliculas de ejemplo

function loadMovies(){
    let movies = localStorage.getItem('movies')
    globalMovies = movies ? JSON.parse(movies) : [] 
    // Mostrar en el grid
    renderGrid(globalMovies)
    renderSlider()
}

// Renderizar peliculas

function renderGrid(movies){
    let grid = document.getElementById("gridMovies")
    let noMoviesResult = document.getElementById("noMoviesResult")

    if(movies.length ===0){
        grid.innerHTML = ""
        noMoviesResult.style.display = "block"
        return
    }

    noMoviesResult.style.display = "none"
    grid.innerHTML = movies.map( m =>
        `
        <div class ="col-md-6 col-lg-4 col-xl-3">
            <div class="movie-card">
                <img src="${m.image}" class="movie-image" onerror="this.src='https://media.istockphoto.com/id/2170017450/vector/film-strip-icon-transparent-checkered-background-black-rectangular-border-cinematic-frame.jpg?s=612x612&w=0&k=20&c=l9RwuFCl3VKq-aT6V1svmVKhcKObxM_7H7BysZ6Eds0='">
                <div class="movie-content">
                    <h5 class="movie-title">${m.title}</h5>                   
                    <span class="movie-genre">${m.genre}</span>
                    <div class="movie-meta"> <b> ${m.year} </b> - ${m.director}</div>
                    <div class="movie-rating">✨ ${m.rate}/10</div>
                    <div class="movie-description">${m.description}</div>
                    <div class ="movie-actions">
                        <button class="btn btn-info" onclick="showMovieDetail(${m.id})"><i class="bi bi-eye-fill"></i> Detalles</button>
                        <button class="btn btn-warning" onclick="editMovieDetail(${m.id})"><i class="bi bi-pencil-fill"></i> Editar</button>
                        <button class="btn btn-danger" onclick="deleteMovie(${m.id},'${m.title}')"><i class="bi bi-trash3-fill"></i> Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        `
    ).join("")
}

// ======== Agregar o Editar peliculas =========//

function saveMovie(){
    //Obtener datos del formulario
    let title = document.getElementById("inputTitle").value.trim()
    let genre = document.getElementById("inputGenre").value.trim()
    let director = document.getElementById("inputDirector").value.trim()
    let year = document.getElementById("inputYear").value.trim()
    let rate = document.getElementById("inputRate").value.trim()
    let description = document.getElementById("inputDescription").value.trim()
    let image = document.getElementById("inputImage").value.trim()

    // Validar si estamos editando o agregando una nueva pelicula

    if(editingMovie){
        // Editando pelicula
        // Buscar pelicula en el array de peliculas
        let index = globalMovies.findIndex((m)=> m.id === editingMovie.id)
        // Si se encuentra pelicula se guarda en localStorage
        if( index !== -1){
            globalMovies[index] = {
                ...globalMovies[index],// Copiar informacion de pelicula
                title,
                genre,
                director,
                year,
                rate,
                description,
                image
            }
            alert(`Pelicula ${title} fue editada con exito ✅`)
        }
    } else {
        // Agregando nueva pelicula
        // Crear objeto para guardar la  nueva pelicula
        let newMovie = {
            id: Date.now(),
            title,
            genre,
            director,
            year,
            rate,
            description,
            image,
            creationDate: new Date()
        }  
        // Agregar pelicula a la lista de peliculas
        globalMovies.unshift(newMovie)
        alert(`Pelicula ${title} fue agregada exitosamente ✅`)      
    }

    
    // Agregar pelicula a localStorage
    localStorage.setItem("movies",JSON.stringify(globalMovies))
    editingMovie = null // limpiar variable edicion
    // cargar peliculas en el dashboard
    loadMovies()

    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById("modalMovie")).hide()
    // Borrar datos del modal
    document.querySelector("#formMovie").reset()
}

function editMovieDetail(id){
    // Encontrar la pelicula para editarla
    let movie = globalMovies.find((m) => m.id === id)
    if(movie){
        // Si se encuentra la pelicula, llenamos el formulario
        editingMovie = movie // actualizar variable global
        //llenar campos del formulario
        document.getElementById("inputTitle").value = movie.title
        document.getElementById("inputGenre").value = movie.genre
        document.getElementById("inputDirector").value = movie.director
        document.getElementById("inputYear").value = movie.year
        document.getElementById("inputRate").value = movie.rate
        document.getElementById("inputDescription").value = movie.description
        document.getElementById("inputImage").value = movie.image
        //cambiar titulo del modal
        document.getElementById("modalTitle").textContent = `Editar Película: ${movie.title}`
        // Abrir el modal
        let modal = new bootstrap.Modal(document.getElementById("modalMovie"))
        modal.show()
    }
}

// Eliminar pelicula

function deleteMovie(id,movieTitle){
    // confirmar si desea eliminar la pelicula

    let confirmDelete = confirm(`¿Desea eliminar la pelicula ${movieTitle}?`)

    if (confirmDelete){
        // Buscar o filtrar las peliculas que no tengan el id
        globalMovies = globalMovies.filter((m)=> m.id !== id)
        // Guardar las peliculas en localStorage
        localStorage.setItem("movies",JSON.stringify(globalMovies))
        // Actualizar el dashboard
        loadMovies()
        alert(`Pelicula ${movieTitle} eliminada con exito ✅`)
    }

}

// Mostrar detalles de la pelicula

function showMovieDetail(id){
    // Encontrar la pelicula para mostrar los detalles
    let movie = globalMovies.find((m) => m.id === id)

    if(movie){
        document.getElementById("detailsTitle").textContent = movie.title
        document.getElementById("detailsGenre").textContent = movie.genre
        document.getElementById("detailsDirector").textContent = movie.director
        document.getElementById("detailsYear").textContent = movie.year
        document.getElementById("detailsRate").textContent = movie.rate
        document.getElementById("detailsDescription").textContent = movie.description
        document.getElementById("detailsImage").src = movie.image
        // Abrir el modal
        let modal = new bootstrap.Modal(document.getElementById("modalDetails"))
        modal.show()
    }
}

// Funcion para renderizar Slider o carrusel

function renderSlider(){
    let carousel = document.getElementById('carouselMovies')
    carousel.innerHTML = ""
    // Mostrar peliculas recientes
    let recentMovies = [...globalMovies].sort((yearA, yearB) => yearB.year - yearA.year).slice(0,5)
    
    recentMovies.forEach((m)=>{
        let card = document.createElement("div")
        card.className = "slider-movie-card"
        card.innerHTML = `
            <img src="${m.image}" onerror="this.src='https://media.istockphoto.com/id/2170017450/vector/film-strip-icon-transparent-checkered-background-black-rectangular-border-cinematic-frame.jpg?s=612x612&w=0&k=20&c=l9RwuFCl3VKq-aT6V1svmVKhcKObxM_7H7BysZ6Eds0='"></img>
            <div class="slider-movie-info">
                <h6>${m.title}</h6>
                <small class="text-muted">${m.year}</small>
            </div>
        `
        card.addEventListener("click",()=> showMovieDetail(m.id))
        carousel.appendChild(card)
    })
}

// Movimiento del scroll

function scrollSlider(direction){
    let slider = document.getElementById("carouselMovies")
    let scroll = 200
    slider.scrollBy({
        left: direction * scroll,
        behavior: "smooth"
    })
}