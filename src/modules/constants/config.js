const environment = () => {
    let location = 'ezcar.id'; // domain for mobile apps
    if (process.env.REACT_APP_START_WEB && typeof window !== 'undefined') {
      location = window.location.host;
    }
  
    const parts = location.split('.');
    const domainToSearch = [parts[0], parts[parts.length - 1]].join('|');
  
    let urlApi = 'https://eztruck.byme.tech/api';
    let socketUrl = 'https://eztruck.byme.tech';
    // urlApi = 'http://localhost:3001/api';
    // socketUrl = 'http://localhost:3001';
    urlApi = 'https://apicar.eztruk.com';
    socketUrl = 'https://apicar.eztruk.com';
  
    let socketPath = '/api/socket.io';
    let googleApiKey = 'AIzaSyB_HIpyugMy5hwgEoWV7_iFlBLf5obJnOs';
    let googleApiMobile = 'AIzaSyB_HIpyugMy5hwgEoWV7_iFlBLf5obJnOs';
    switch (domainToSearch) {
      case 'ezcar|id': {
        urlApi = 'https://apicar.eztruk.com';
        socketUrl = 'https://apicar.eztruk.com';
        socketPath = '/socket.io';
        googleApiKey = 'AIzaSyB_HIpyugMy5hwgEoWV7_iFlBLf5obJnOs';
        googleApiMobile = 'AIzaSyB_HIpyugMy5hwgEoWV7_iFlBLf5obJnOs';
        break;
      }
      case 'eztruck|tech': {
        urlApi = 'https://eztruck.byme.tech/api';
        socketUrl = 'https://eztruck.byme.tech';
        socketPath = '/api/socket.io';
        googleApiKey = 'AIzaSyArUnNN0HNHrQy366iDSHDXFqV8zmqM5XA';
        googleApiMobile = 'AIzaSyCi90T9cF6yNVAe0RuCIsUfWGXGtq6WPjs';
        break;
      }
      default: {
        break;
      }
    }
  
    return {
      urlApi,
      socketUrl,
      socketPath,
      googleApiKey,
      googleApiMobile
    };
  };
  
  const settings = () => {
    const result = {};
  
    // order settings
    result.order = {};
    result.order.initialDeparture = {
      address:
        'Jalan Riau no.23, Gondangdia, Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia',
      coordinates: [-6.1917687532083265, 106.82432153558193]
    };
    result.order.force = {};
    result.order.force.allSeat = false;
  
    result.order.show = {};
    result.order.show.allSeat = false;
    // end order settings
  
    return result;
  };
  
  export default {
    appName: 'EZCar',
    description: 'EZCar Application',
    api: environment().urlApi,
    settings: settings(),
    socket: {
      url: environment().socketUrl,
      path: environment().socketPath
    },
    tokenName: 'ezcar_t',
    googleApiKey: environment().googleApiKey,
    googleApiMobile: environment().googleApiMobile
  };
  