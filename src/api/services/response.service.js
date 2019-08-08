class ResponseService {
  static greet(username) {
    return { message: `Hello ${username}!` };
  }

  static userLoggedIn() {
    return { message: 'LOGGED_IN' };
  }

  static userLoggedOut() {
    return { message: 'LOGGED_OUT' };
  }

  static unAuthorized() {
    return { message: 'UNAUTHORIZED' };
  }

  static sucessfullDBOperation(payload) {
    const { results } = payload || [];
    return { status: 1, ...results };
  }

  static unsuccessfullDBOperation() {
    return { status: 0 };
  }

  static fileFormatNotSupported() {
    return { status: 0, message: 'FILE FORMAT NOT SUPPORTED' };
  }
  static recordAlreadyExists() {
    return { status: 1, message: 'RECORD ALREADY EXISTS' };
  }
}

module.exports = ResponseService;
