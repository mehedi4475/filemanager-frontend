import decode from 'jwt-decode';
export default class AuthService {
  // Initializing important variables
  constructor(domain) {
    this.domain = domain || 'http://filemanager.damjanun.com'; // API server domain
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  createFolder(folderName, currentPath) {
    return this.fetch(`${this.domain}/directory-create`, {
      method: 'POST',
      body: JSON.stringify({
        directory_name: folderName,
        current_path: currentPath,
      }),
    }).then(res => {
      return Promise.resolve(res);
    });
  }

  getFolder(currentPath) {
    return this.fetch(`${this.domain}/directory-all-files`, {
      method: 'POST',
      body: JSON.stringify({
        current_path: currentPath,
      }),
    }).then(res => { 
      return Promise.resolve(res);
    });
  }

  copyFileFolder(copy_from, copy_to) {
    return this.fetch(`${this.domain}/file-copy`, {
      method: 'POST',
      body: JSON.stringify({
        copy_from,
        copy_to
      }),
    }).then(res => { 
      return Promise.resolve(res);
    });
  }

  moveFileFolder(move_from, move_to) {
    return this.fetch(`${this.domain}/file-move`, {
      method: 'POST',
      body: JSON.stringify({
        move_from,
        move_to
      }),
    }).then(res => { 
      return Promise.resolve(res);
    });
  }

  uploadFile(fileName, path) {
    const formData = new FormData()
    formData.append('fileName', fileName);
    formData.append('path', path);

    return fetch(`${this.domain}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: formData,
    }).then(res => { 
      return Promise.resolve(res);
    });
  }

  login(username, password) {
    return this.fetch(`${this.domain}/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    }).then(res => {
      this.setToken(res.success.token); 
      return Promise.resolve(res);
    });
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
 }