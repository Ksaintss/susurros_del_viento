// URL del backend
const URL_API = 'https://backend-susurrosdelviento.onrender.com';

// Productos base por si el servidor aún no está encendido
const productosBase = [
  {
    _id: '1',
    nombre: 'Amigurumi Totoro Guardián del Bosque',
    descripcion: 'Muñeco tejido a mano en crochet con hilo de algodón hipoalergénico y hojita bordada.',
    precio: 65000,
    imagen: 'assets/img/Totoro.jpg',
    personaje: 'Totoro'
  },
  {
    _id: '2',
    nombre: 'Lámpara Artesanal Calcifer en Resina',
    descripcion: 'Pequeña lámpara de escritorio moldeada y pintada a mano con luz cálida tipo fogata.',
    precio: 85000,
    imagen: 'assets/img/Calcifer.jpg',
    personaje: 'Calcifer'
  },
  {
    _id: '3',
    nombre: 'Taza de Cerámica Sin Cara (Kaonashi)',
    descripcion: 'Taza torneada en arcilla y esmaltada a mano en horno artesanal, capacidad de 350 ml.',
    precio: 48000,
    imagen: 'assets/img/SinCara.jpg',
    personaje: 'Sin Cara'
  },
  {
    _id: '4',
    nombre: 'Máscara Decorativa Princesa Mononoke',
    descripcion: 'Escultura de pared tallada en madera liviana y pintada con acrílicos mates.',
    precio: 92000,
    imagen: 'assets/img/Mononoke.jpg',
    personaje: 'Mononoke'
  },
  {
    _id: '5',
    nombre: 'Terrario de Cristal Ponyo en el Mar',
    descripcion: 'Mini escenario hecho a mano con figuras en porcelana fría y piedras naturales.',
    precio: 58000,
    imagen: 'assets/img/ponyoterrario.png',
    personaje: 'Ponyo'
  },
  {
    _id: '6',
    nombre: 'Tote Bag Bordada Jiji y Kiki',
    descripcion: 'Bolso de lienzo crudo 100% algodón con bordado artesanal hecho puntada a puntada.',
    precio: 42000,
    imagen: 'assets/img/kiki&jiji.png',
    personaje: 'Kiki'
  }
];

// Productos destacados del Inicio. El Catálogo también los usa
// (antes se leían del index.html con un fetch + DOMParser).
const productosDestacados = [
  {
    nombre: 'Amigurumi Totoro Guardián del Bosque',
    personaje: 'Totoro',
    descripcion: 'Muñeco tejido a mano en crochet con hilo de algodón hipoalergénico y hojita bordada.',
    precio: 65000,
    imagen: 'assets/img/totoro.png'
  },
  {
    nombre: 'Lámpara Artesanal Calcifer en Resina',
    personaje: 'Calcifer',
    descripcion: 'Pequeña lámpara de escritorio moldeada y pintada a mano con luz cálida tipo fogata.',
    precio: 85000,
    imagen: 'assets/img/calcifer.png'
  },
  {
    nombre: 'Taza de Cerámica Sin Cara (Kaonashi)',
    personaje: 'Sin Cara',
    descripcion: 'Taza torneada en arcilla y esmaltada a mano en horno artesanal, capacidad de 350 ml.',
    precio: 48000,
    imagen: 'assets/img/tazasincara.png'
  },
  {
    nombre: 'Máscara Decorativa Princesa Mononoke',
    personaje: 'Mononoke',
    descripcion: 'Escultura de pared tallada en madera liviana y pintada con acrílicos mates.',
    precio: 92000,
    imagen: 'assets/img/mascaramononoke.png'
  }
];
