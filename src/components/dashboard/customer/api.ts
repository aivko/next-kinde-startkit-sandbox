interface RequestOptions {
  method: string;
  payload?: any;
  uri: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Failed to send data to backend, ${response}`);
  }
  return await response.json();
};

const sendRequest = async ({ method, payload, uri }: RequestOptions) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(uri, options);
    return handleResponse(response);
  } catch (error) {
    console.error('Error sending data to backend:', error);
    throw error;
  }
};

export const createCustomer = async (payload: any) => {
  return sendRequest({
    method: "POST",
    payload,
    uri: "/api/customer"
  });
};

export const fetchAllCustomer = async (payload: any) => {
  payload.mode = 'all';
  return sendRequest({
    method: "POST",
    payload,
    uri: "/api/customer"
  });
};

export const updateCustomer = async (payload: any) => {
  return sendRequest({
    method: "PATCH",
    payload,
    uri: "/api/customer"
  });
};

export const fetchCustomer = async (payload: any) => {
  payload.mode = 'single';
  return sendRequest({
    method: "POST",
    payload,
    uri: '/api/customer',
  });
};

export const removeCustomer = async (client:object) => {
  return sendRequest({
    method: "DELETE",
    uri: "/api/customer",
    payload: client
  });
};

export const fetchCustomersList = async () => {
  return sendRequest({
    method: "GET",
    uri: '/api/customer',
  });
};
