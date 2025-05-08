interface RequestOptions {
  method: string;
  payload?: any;
  apiUrl: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to send data to backend, ${response}`);
  }
  return await response.json();
};

const sendRequest = async ({ method, payload, apiUrl }: RequestOptions) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  try {
    const response = await fetch(apiUrl, options);
    return handleResponse(response);
  } catch (error) {
    console.error('Error sending data to backend:', error);
    throw error;
  }
};

export const createAdmin = async (payload: any) => {
  return sendRequest({
    method: "POST",
    payload,
    apiUrl: `/api/admin`
  });
};

export const updateAdmin = async (payload: any) => {
  return sendRequest({
    method: "PATCH",
    payload,
    apiUrl: `/api/admin`
  });
};

export const fetchAdmin = async () => {
  return sendRequest({
    method: "GET",
    apiUrl: `/api/admin`
  });
};

export const fetchAgencies = async () => {
  return sendRequest({
    method: "GET",
    apiUrl: `/api/agency`
  });
};

export const removeAgencyBySa = async (payload: any) => {
  return sendRequest({
    method: "DELETE",
    payload,
    apiUrl: `/api/agency`
  });
};