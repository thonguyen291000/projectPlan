import _ from "lodash";

const formatGraphqlErrors = (error) => {
  const errorDetails = _.get(error, "originalError.response.body");

  try {
    if (errorDetails) return JSON.parse(errorDetails);
  } catch (error) {}

  return error;
};

export default formatGraphqlErrors;
