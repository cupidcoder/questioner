const statusCodes = {
  // generic success
  success: 200,
  // resource created
  created: 201,
  // bad request caused by client
  badRequest: 400,
  // unauthorized request due to bad / missing credentials
  unauthorized: 401,
  // forbidden due to correct credentials but unprivileged resource
  forbidden: 403,
  // not found
  notFound: 404,
  // generic server error
  unavailable: 503,
};

export default statusCodes;
