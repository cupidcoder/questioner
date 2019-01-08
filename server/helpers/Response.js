/**
 * A wrapper for endpoint response
 * @package Response
 */
class APIReponse {
  constructor() {
    this.type = '';
    this.statusCode = '';
    this.data = [];
    this.error = '';
  }

  /**
   * Checks whether value is a valid {object}
   * @param {any} value
   * @returns {boolean} true/false
   */
  static isObject(value) {
    if (value === null) { return false; }
    return ((typeof value === 'function') || (typeof value === 'object'));
  }

  /**
   * Sets API response for 200 & 201
   * @param {int} statusCode
   * @param {object} data
   */
  setSuccess(statusCode, data = []) {
    this.statusCode = statusCode;
    if (Array.isArray(data)) {
      this.data = data;
    } else if (APIReponse.isObject(data)) {
      this.data.push(data);
    }
    this.type = 'success';
  }

  /**
   * sets API response for 400, 401, 403, 404, 503
   * @param {int} statusCode
   * @param {string} error
   */
  setFailure(statusCode, error = 'error') {
    this.statusCode = statusCode;
    this.error = error;
    this.type = 'failure';
  }

  /**
   * Sends response
   * @param {object} res
   * @returns {object} responseObject
   */
  send(res) {
    if (this.type === 'success') {
      return res.status(this.statusCode).send({
        status: this.statusCode,
        data: this.data,
      });
    }
    // Here this.type === 'failure'
    return res.status(this.statusCode).send({
      status: this.statusCode,
      error: this.error,
    });
  }
}

export default APIReponse;
