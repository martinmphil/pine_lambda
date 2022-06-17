const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const putFn = jest
  .fn()
  .mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

const getFn = jest
  .fn()
  .mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

const updateFn = jest
  .fn()
  .mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

class DocumentClient {
  put = putFn;
  get = getFn;
  update = updateFn;
}

const DynamoDB = {
  DocumentClient,
};

exports.awsSdkPromiseResponse = awsSdkPromiseResponse;
exports.DynamoDB = DynamoDB;
